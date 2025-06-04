import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight } from "lucide-react";

const Trabalhos = () => {
  const location = useLocation();
  const [trabalhos, setTrabalhos] = useState([]);
  const [palavrasChave, setPalavrasChave] = useState<string[]>([]);
  const [tiposPublicacao, setTiposPublicacao] = useState<string[]>([]);
  const [filtrosSelecionados, setFiltrosSelecionados] = useState<string[]>([]);
  const [bibtexMap, setBibtexMap] = useState<Record<string, string>>({});
  const [cardsExpandidos, setCardsExpandidos] = useState<Record<number, boolean>>({});
  const [resumos, setResumos] = useState<Record<string, string>>({});
  const [avisos, setAvisos] = useState<Record<string, boolean>>({});

  const orcid = new URLSearchParams(location.search).get("orcid");

  useEffect(() => {
    if (orcid) {
      // Trabalhos
      fetch(`https://pub.orcid.org/v3.0/${orcid}/works`, {
        headers: { Accept: "application/json" },
      })
        .then(res => res.json())
        .then(data => {
          const listaTrabalhos = data["group"] || [];
          setTrabalhos(listaTrabalhos);

          // Tipos de publicação
          const tipos = new Set<string>();
          listaTrabalhos.forEach(t => {
            const tipo = t?.["work-summary"]?.[0]?.type;
            if (tipo) tipos.add(tipo);
          });
          setTiposPublicacao(Array.from(tipos));
        });

      // Palavras-chave
      fetch(`https://pub.orcid.org/v3.0/${orcid}/person`, {
        headers: { Accept: "application/json" },
      })
        .then(res => res.json())
        .then(data => {
          const palavras = data?.keywords?.keyword?.map(k => k.content) || [];
          setPalavrasChave(palavras);
        });
    }
  }, [orcid]);

  const toggleFiltro = (valor: string) => {
    setFiltrosSelecionados(prev =>
      prev.includes(valor) ? prev.filter(f => f !== valor) : [...prev, valor]
    );
  };

  const buscarBibtex = async (doi: string) => {
    if (bibtexMap[doi]) return; // já carregado

    try {
      const res = await fetch(`https://doi.org/${doi}`, {
        headers: { Accept: "application/x-bibtex" },
      });
      const bibtex = await res.text();
      setBibtexMap(prev => ({ ...prev, [doi]: bibtex }));
    } catch (err) {
      setBibtexMap(prev => ({ ...prev, [doi]: "Erro ao obter BibTeX" }));
    }
  };

  const copiarBibtex = async (doi: string) => {
    if (!bibtexMap[doi]) {
      await buscarBibtex(doi);
    }
    const bibtex = bibtexMap[doi];
    if (bibtex) {
      await navigator.clipboard.writeText(bibtex);
      setAvisos(prev => ({ ...prev, [doi]: true }));
      setTimeout(() => {
        setAvisos(prev => ({ ...prev, [doi]: false }));
      }, 3000);
    }
  };

  const baixarBibtex = async (doi: string, titulo?: string) => {
    if (!bibtexMap[doi]) {
      await buscarBibtex(doi);
    }
    const bibtex = bibtexMap[doi];
    if (bibtex) {
      const blob = new Blob([bibtex], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      const nomeArquivo = `${titulo?.replace(/\s+/g, "_") || doi}.bib`;
      link.download = nomeArquivo;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Função para buscar resumo via CrossRef pelo DOI
  const buscarResumo = async (doi: string) => {
    if (resumos[doi]) return; // já tem resumo

    try {
      const res = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`, {
        headers: { Accept: "application/json" },
      });
      const data = await res.json();
      const abs = data.message.abstract || "Resumo não disponível.";
      setResumos(prev => ({ ...prev, [doi]: abs }));
    } catch {
      setResumos(prev => ({ ...prev, [doi]: "Erro ao obter resumo." }));
    }
  };

  // Controla a expansão do card e busca resumo quando expandir
  const toggleExpandir = (idx: number) => {
    setCardsExpandidos(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const onExpandClick = (idx: number, doi?: string) => {
    toggleExpandir(idx);
    if (doi) buscarResumo(doi);
  };

  const palavrasSelecionadas = filtrosSelecionados.filter(f => palavrasChave.includes(f));
  const tiposSelecionados = filtrosSelecionados.filter(f => tiposPublicacao.includes(f));

  const trabalhosFiltrados = trabalhos.filter(t => {
    const summary = t?.["work-summary"]?.[0];
    const titulo = summary?.title?.title?.value?.toLowerCase() || "";
    const tipo = summary?.type || "";

    const passouPalavra =
      palavrasSelecionadas.length === 0 ||
      palavrasSelecionadas.some(p => titulo.includes(p.toLowerCase()));

    const passouTipo =
      tiposSelecionados.length === 0 || tiposSelecionados.includes(tipo);

    return passouPalavra && passouTipo;
  });

  return (
    <Layout>
      <div className="py-8">
        <h1 className="text-2xl font-bold mb-6">Trabalhos Acadêmicos</h1>

        {/* Dropdown de filtros */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              Filtrar por palavra-chave ou tipo
              <ChevronDown size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 max-h-96 overflow-y-auto">
            <div className="mb-2 font-semibold text-sm">Palavras-chave</div>
            {palavrasChave.map((palavra, idx) => (
              <div key={`p-${idx}`} className="flex items-center space-x-2 mb-1">
                <Checkbox
                  id={`palavra-${idx}`}
                  checked={filtrosSelecionados.includes(palavra)}
                  onCheckedChange={() => toggleFiltro(palavra)}
                />
                <label htmlFor={`palavra-${idx}`} className="text-sm">
                  {palavra}
                </label>
              </div>
            ))}
            <div className="mt-4 mb-2 font-semibold text-sm">Tipos de publicação</div>
            {tiposPublicacao.map((tipo, idx) => (
              <div key={`t-${idx}`} className="flex items-center space-x-2 mb-1">
                <Checkbox
                  id={`tipo-${idx}`}
                  checked={filtrosSelecionados.includes(tipo)}
                  onCheckedChange={() => toggleFiltro(tipo)}
                />
                <label htmlFor={`tipo-${idx}`} className="text-sm capitalize">
                  {tipo.replace(/-/g, " ")}
                </label>
              </div>
            ))}
          </PopoverContent>
        </Popover>

        {/* Filtros ativos */}
        <div className="flex flex-wrap gap-2 mt-4 mb-6">
          {filtrosSelecionados.map((f, idx) => (
            <Badge
              key={idx}
              variant="outline"
              className="cursor-pointer"
              onClick={() => toggleFiltro(f)}
            >
              {f} ✕
            </Badge>
          ))}
        </div>

        {/* Lista de trabalhos */}
        {trabalhosFiltrados.length > 0 ? (
          <div className="grid gap-4">
            {trabalhosFiltrados.map((t, idx) => {
              const summary = t?.["work-summary"]?.[0];
              const titulo = summary?.title?.title?.value;
              const ano = summary?.["publication-date"]?.year?.value;
              const tipo = summary?.type;
              const dois = summary?.["external-ids"]?.["external-id"] || [];
              const doi = dois.find(id => id["external-id-type"] === "doi")?.["external-id-value"];

              return (
                <Card key={idx}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{titulo || "Sem título"}</p>
                        {ano && <p className="text-sm text-gray-500">Publicado em {ano}</p>}
                      </div>
                      <div className="flex items-center space-x-2">
                        {tipo && (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-600 border-green-200 capitalize"
                          >
                            {tipo.replace(/-/g, " ")}
                          </Badge>
                        )}
                        <button
                          onClick={() => onExpandClick(idx, doi)}
                          aria-expanded={!!cardsExpandidos[idx]}
                          aria-label={cardsExpandidos[idx] ? "Esconder resumo" : "Mostrar resumo"}
                          className="ml-4 p-1 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{
                            transform: cardsExpandidos[idx] ? "rotate(90deg)" : "rotate(0deg)",
                            transition: "transform 0.2s ease",
                          }}
                        >
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    </div>

                    {cardsExpandidos[idx] && (
                      <div className="mt-4 text-sm prose max-w-none">
                        {resumos[doi] ? (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: resumos[doi].replace(/<\/?jats:[^>]*>/g, ""),
                            }}
                          />
                        ) : (
                          <p>Carregando resumo...</p>
                        )}
                        {doi && (
                          <p className="mt-2">
                            <a
                              href={`https://doi.org/${doi}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              Ler artigo completo
                            </a>
                          </p>
                        )}

                        <div className="mt-4 flex space-x-4 items-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copiarBibtex(doi)}
                          >
                            Copiar BibTeX
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => baixarBibtex(doi, titulo)}
                          >
                            Baixar BibTeX
                          </Button>

                          {/* Aviso de cópia */}
                          {avisos[doi] && (
                            <span className="ml-4 text-green-600 font-medium">
                              Copiado!
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <p>Nenhum trabalho encontrado para os filtros selecionados.</p>
        )}
      </div>
    </Layout>
  );
};

export default Trabalhos;
