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
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());

  const orcid = new URLSearchParams(location.search).get("orcid");

  useEffect(() => {
    if (orcid) {
      fetch(`https://pub.orcid.org/v3.0/${orcid}/works`, {
        headers: { Accept: "application/json" },
      })
        .then(res => res.json())
        .then(data => {
          const listaTrabalhos = data["group"] || [];
          setTrabalhos(listaTrabalhos);

          const tipos = new Set<string>();
          listaTrabalhos.forEach(t => {
            const tipo = t?.["work-summary"]?.[0]?.type;
            if (tipo) tipos.add(tipo);
          });
          setTiposPublicacao(Array.from(tipos));
        });

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

  const toggleSelecionado = (doi: string) => {
    setSelecionados(prev => {
      const novo = new Set(prev);
      if (novo.has(doi)) {
        novo.delete(doi);
      } else {
        novo.add(doi);
      }
      return novo;
    });
  };

  const buscarBibtex = async (doi: string): Promise<string | null> => {
    try {
      const res = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}/transform/application/x-bibtex`);
      const bibtex = await res.text();
      setBibtexMap(prev => ({ ...prev, [doi]: bibtex }));
      return bibtex;
    } catch {
      setBibtexMap(prev => ({ ...prev, [doi]: "Erro ao obter BibTeX" }));
      return null;
    }
  };

  const copiarBibtex = async (doi: string) => {
    if (!bibtexMap[doi]) {
      await buscarBibtex(doi);
    }
    const bibtex = bibtexMap[doi];
    if (bibtex) {
      await navigator.clipboard.writeText(bibtex);
      alert("BibTeX copiado para a área de transferência!");
    }
  };

  const baixarBibtex = async (doi: string) => {
  let bib = bibtexMap[doi];
  if (!bib) {
    bib = await buscarBibtex(doi);
  }
  if (bib) {
    const blob = new Blob([bib], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `trabalho_${doi.replace(/\//g, "_")}.bib`;  // <-- corrigido aqui
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};


  const baixarSelecionados = async () => {
    if (selecionados.size === 0) return;

    const bibs: string[] = [];

    for (const doi of selecionados) {
      let bib = bibtexMap[doi];
      if (!bib) {
        bib = await buscarBibtex(doi);
      }
      if (bib) {
        bibs.push(bib);
      }
    }

    if (bibs.length === 0) {
      alert("Nenhum BibTeX encontrado.");
      return;
    }

    const conteudo = bibs.join("\n\n");
    const blob = new Blob([conteudo], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "trabalhos_selecionados.bib";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const buscarResumo = async (doi: string) => {
    try {
      const res = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`);
      const data = await res.json();
      const resumo = data?.message?.abstract || "Resumo não disponível.";
      setResumos(prev => ({ ...prev, [doi]: resumo }));
    } catch {
      setResumos(prev => ({ ...prev, [doi]: "Erro ao carregar o resumo." }));
    }
  };
  const trabalhosFiltrados = trabalhos.filter(t => {
    const summary = t?.["work-summary"]?.[0];
    const titulo = summary?.title?.title?.value?.toLowerCase() || "";
    const tipo = summary?.type || "";

    const palavrasSelecionadas = filtrosSelecionados.filter(f => palavrasChave.includes(f));
    const tiposSelecionados = filtrosSelecionados.filter(f => tiposPublicacao.includes(f));

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

        <Button onClick={baixarSelecionados} className="mb-6">
          Baixar selecionados (.bib)
        </Button>

        <div className="grid gap-4">
          {trabalhosFiltrados.map((t, idx) => {
            const summary = t?.["work-summary"]?.[0];
            const titulo = summary?.title?.title?.value || "Sem título";
            const ano = summary?.["publication-date"]?.year?.value;
            const tipo = summary?.type;
            const dois = summary?.["external-ids"]?.["external-id"] || [];
            const doi = dois.find(id => id["external-id-type"] === "doi")?.["external-id-value"];

            if (!doi) return null;

            return (
              <Card key={doi}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <Checkbox
                        checked={selecionados.has(doi)}
                        onCheckedChange={() => toggleSelecionado(doi)}
                        className="mr-2 mt-1"
                      />
                      <div>
                        <p className="font-semibold">{titulo}</p>
                        {ano && <p className="text-sm text-gray-500">Publicado em {ano}</p>}
                      </div>
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
                        onClick={() => {
                          setCardsExpandidos(prev => ({ ...prev, [idx]: !prev[idx] }));
                          if (!resumos[doi]) buscarResumo(doi);
                        }}
                        className="ml-4 p-1 rounded hover:bg-gray-200"
                      >
                        <ChevronRight
                          size={20}
                          style={{
                            transform: cardsExpandidos[idx] ? "rotate(90deg)" : "rotate(0deg)",
                            transition: "transform 0.2s ease",
                          }}
                        />
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
                      <div className="mt-4 flex space-x-4">
                        <Button size="sm" variant="outline" onClick={() => copiarBibtex(doi)}>
                          Copiar BibTeX
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => baixarBibtex(doi)}>
                          Baixar .bib
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Trabalhos;