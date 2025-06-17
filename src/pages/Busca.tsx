import React, { useState } from "react";
import Layout from "../components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, User, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

const Busca = () => {
  // Estados gerais
  const [activeTab, setActiveTab] = useState("perfil");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;
  const totalPages = Math.ceil(searchResults.length / resultsPerPage);
  const [expandedCard, setExpandedCard] = useState<number | null>(null); // Para controlar a expansão
  const [selectedArticles, setSelectedArticles] = useState<Set<number>>(new Set()); // Para controle de artigos selecionados

  const navigate = useNavigate();

  // Estados para busca de perfil ORCID
  const [orcidSearch, setOrcidSearch] = useState("");

  // Estados para busca de artigos Crossref
  const [keyword, setKeyword] = useState("");
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [containerTitle, setContainerTitle] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");

  // Paginação para resultados já carregados (perfil ORCID usa paginação simulada local)
  const paginatedResults = searchResults.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  const handleNextPage = () => {
    if (activeTab === "perfil") {
      if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    } else if (activeTab === "artigos") {
      setCurrentPage((prev) => prev + 1);
      handleArticleSearchPagination(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (activeTab === "perfil") {
      if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    } else if (activeTab === "artigos") {
      if (currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
        handleArticleSearchPagination(currentPage - 1);
      }
    }
  };

  // Busca perfis ORCID
  const handleOrcidSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setSearchResults([]);
    setCurrentPage(1);

    try {
      const searchParam = orcidSearch.trim();

      if (!searchParam) {
        setIsSearching(false);
        return;
      }

      // Query simplificada (você pode ajustar)
      const query = encodeURIComponent(
        `given-names:${searchParam} OR family-name:${searchParam} OR orcid:${searchParam}`
      );

      const res = await fetch(
        `https://pub.orcid.org/v3.0/expanded-search/?q=${query}&rows=50`,
        {
          headers: { Accept: "application/json" },
        }
      );

      const data = await res.json();

      const results =
        data["expanded-result"]?.map((entry: any) => {
          const givenNames = Array.isArray(entry["given-names"])
            ? entry["given-names"].join(" ")
            : entry["given-names"] || "";

          const familyName = Array.isArray(entry["family-names"])
            ? entry["family-names"].join(" ")
            : entry["family-names"] || "";

          return {
            orcid: entry["orcid-id"],
            nome: `${givenNames}`,
            sobrenome: familyName,
            afiliacao: entry["institution-name"]?.[0] || "Não disponível",
            palavrasChave: entry["keywords"] || [],
          };
        }) || [];

      setSearchResults(results);
    } catch (error) {
      console.error("Erro ao buscar ORCID:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Busca artigos Crossref (primeira página)
  const handleArticleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    await fetchArticles(1);
  };

  // Função para busca paginada de artigos
  const handleArticleSearchPagination = async (page: number) => {
    await fetchArticles(page);
  };

  // Função que executa a busca na API Crossref
  const fetchArticles = async (page: number) => {
    setIsSearching(true);
    setSearchResults([]);

    try {
      const params = new URLSearchParams();

      if (keyword.trim()) params.append("query", keyword.trim());
      if (author.trim()) params.append("query.author", author.trim());
      if (title.trim()) params.append("query.title", title.trim());
      if (containerTitle.trim()) params.append("query.container-title", containerTitle.trim());

      const filters = [];
      if (yearFrom.trim()) filters.push(`from-pub-date:${yearFrom}-01-01`);
      if (yearTo.trim()) filters.push(`until-pub-date:${yearTo}-12-31`);
      if (filters.length > 0) {
        params.append("filter", filters.join(","));
      }

      params.append("rows", resultsPerPage.toString());
      params.append("offset", ((page - 1) * resultsPerPage).toString());

      const url = `https://api.crossref.org/works?${params.toString()}`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.message && data.message.items) {
        const results = data.message.items.map((item: any, idx: number) => ({
          id: idx,
          titulo: item.title?.[0] || "Sem título",
          autores: (item.author || [])
            .map((a: any) => `${a.given || ""} ${a.family || ""}`.trim())
            .join(", "),
          data:
            item["published-print"]?.["date-parts"]?.[0]?.join("-") ||
            item["published-online"]?.["date-parts"]?.[0]?.join("-") ||
            "Data não disponível",
          keywords: item.subject || [],
          doi: item.DOI,
          link: item.URL,
          resumo: item.abstract || "", // Adicionando resumo
        }));

        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Erro ao buscar artigos:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleVerPerfil = (orcid: string) => {
    sessionStorage.setItem("orcid", orcid);
    navigate(`/?orcid=${orcid}`);
  };

  const renderLoadingOrEmpty = () => {
    if (isSearching) {
      return (
        <p className="text-gray-600 text-sm text-center mt-4">Carregando...</p>
      );
    }

    if (!isSearching && searchResults.length === 0) {
      return (
        <p className="text-gray-600 text-sm text-center mt-4">
          Nenhum resultado encontrado.
        </p>
      );
    }

    return null;
  };

  // Função para exportar Bibtex
  const exportBibtex = (id: number) => {
    const result = searchResults[id];
    const bibtex = `
@article{${result.doi},
  title={${result.titulo}},
  author={${result.autores}},
  year={${result.data}},
  journal={${result.containerTitle}},
  doi={${result.doi}},
  url={${result.link}}
}`;
    const blob = new Blob([bibtex], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.titulo}.bib`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportSelectedBibtex = () => {
    const selectedArticlesList = Array.from(selectedArticles);
    const bibtexEntries = selectedArticlesList.map((id: number) => {
      const result = searchResults[id];
      return `
@article{${result.doi},
  title={${result.titulo}},
  author={${result.autores}},
  year={${result.data}},
  journal={${result.containerTitle}},
  doi={${result.doi}},
  url={${result.link}}
}`;
    }).join("\n\n");
    const blob = new Blob([bibtexEntries], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "artigos_selecionados.bib";
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleArticleSelection = (id: number) => {
    setSelectedArticles((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(id)) {
        newSelection.delete(id);
      } else {
        newSelection.add(id);
      }
      return newSelection;
    });
  };

  return (
    <Layout>
      <div className="pt-16 lg:pt-6">
        <h1 className="text-2xl font-bold mb-6">Busca</h1>

        <Tabs
          defaultValue="perfil"
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value);
            setSearchResults([]);
            setCurrentPage(1);
          }}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="perfil">
              <User className="mr-2 h-4 w-4" />
              Buscar Perfis
            </TabsTrigger>
            <TabsTrigger value="artigos">
              <FileText className="mr-2 h-4 w-4" />
              Buscar Artigos
            </TabsTrigger>
          </TabsList>

          {/* Aba Perfis */}
          <TabsContent value="perfil" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleOrcidSearch} className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="text"
                      placeholder="Buscar por nome ou ORCID"
                      value={orcidSearch}
                      onChange={(e) => setOrcidSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Button type="submit" disabled={isSearching}>
                    Buscar
                  </Button>
                </form>
              </CardContent>
            </Card>

            {renderLoadingOrEmpty()}

            {paginatedResults.length > 0 &&
              activeTab === "perfil" &&
              paginatedResults.map((result, idx) => (
                <Card key={idx}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {result.nome} {result.sobrenome}
                        </h3>
                        <p className="text-sm text-gray-600">ORCID: {result.orcid}</p>
                        <p className="text-sm text-gray-600">
                          Afiliado a: {result.afiliacao}
                        </p>
                        {result.palavrasChave.length > 0 && (
                          <div className="mt-2">
                            <span className="text-xs font-medium text-gray-600">
                              Palavras-chave:
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {result.palavrasChave.map((kw: string, idx2: number) => (
                                <span
                                  key={idx2}
                                  className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs"
                                >
                                  {kw}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <Button
                        onClick={() => handleVerPerfil(result.orcid)}
                        className="ml-auto bg-green-600 hover:bg-green-700 text-white"
                      >
                        Ver Perfil
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

            {searchResults.length > resultsPerPage && (
              <div className="flex justify-center items-center gap-4 mt-4">
                <Button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  variant="outline"
                >
                  Anterior
                </Button>
                <span className="text-sm text-gray-600">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  variant="outline"
                >
                  Próxima
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Aba Artigos */}
          <TabsContent value="artigos" className="space-y-4">
            <Button onClick={exportSelectedBibtex} className="mt-4">
              Exportar Bibtex (Artigos Selecionados)
            </Button>

            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleArticleSearch} className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="text"
                      placeholder="Palavra-chave"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Input
                    type="text"
                    placeholder="Autor"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                  />
                  <Input
                    type="text"
                    placeholder="Título do artigo"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <Input
                    type="text"
                    placeholder="Periódico / Conferência"
                    value={containerTitle}
                    onChange={(e) => setContainerTitle(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Ano inicial"
                      value={yearFrom}
                      onChange={(e) => setYearFrom(e.target.value)}
                      min={1900}
                      max={new Date().getFullYear()}
                    />
                    <Input
                      type="number"
                      placeholder="Ano final"
                      value={yearTo}
                      onChange={(e) => setYearTo(e.target.value)}
                      min={1900}
                      max={new Date().getFullYear()}
                    />
                  </div>
                  <Button type="submit" disabled={isSearching}>
                    Buscar
                  </Button>
                </form>
              </CardContent>
            </Card>

            {renderLoadingOrEmpty()}

            {paginatedResults.length > 0 &&
              activeTab === "artigos" &&
              paginatedResults.map((result: any, idx: number) => (
                <Card key={result.id}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{result.titulo}</h3>
                    <p className="text-sm text-gray-600">Autores: {result.autores}</p>
                    <p className="text-sm text-gray-600">
                      Data: {new Date(result.data).toLocaleDateString("pt-BR")}
                    </p>
                    {result.doi && (
                      <p className="mt-2 text-xs">
                        DOI:{" "}
                        <a
                          href={`https://doi.org/${result.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          {result.doi}
                        </a>
                      </p>
                    )}
                    {result.link && (
                      <p className="mt-1 text-xs">
                        Link:{" "}
                        <a
                          href={result.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          Acessar artigo
                        </a>
                      </p>
                    )}
                    <div className="mt-2 flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedArticles.has(idx)}
                        onChange={() => toggleArticleSelection(idx)}
                        className="mr-2"
                      />
                      <span className="ml-2">Marcar Artigo</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      {expandedCard === idx && result.resumo && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">{result.resumo}</p>
                          <p className="text-xs">
                            Link:{" "}
                            <a
                              href={result.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              Acessar artigo
                            </a>
                          </p>
                        </div>
                      )}
                      {expandedCard !== idx && result.resumo && (
                        <ChevronDown
                          className="text-gray-500 ml-auto"
                          onClick={() => setExpandedCard(idx)}
                        />
                      )}
                      {expandedCard === idx && result.resumo && (
                        <ChevronUp
                          className="text-gray-500 ml-auto"
                          onClick={() => setExpandedCard(null)}
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

            {searchResults.length === resultsPerPage && (
              <div className="flex justify-center items-center gap-4 mt-4">
                <Button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  variant="outline"
                >
                  Anterior
                </Button>
                <span className="text-sm text-gray-600">
                  Página {currentPage}
                </span>
                <Button onClick={handleNextPage} variant="outline">
                  Próxima
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Busca;
