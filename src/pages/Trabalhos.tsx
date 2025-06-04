import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

type ExternalId = {
  "external-id-type": string;
  "external-id-value": string;
};

type Citation = {
  citation: string;
  style_fullname: string;
  style_shortname: string;
};

const email = "seu_email@exemplo.com";

const Trabalhos = () => {
  const location = useLocation();
  const orcid = new URLSearchParams(location.search).get("orcid");

  // Estados
  const [trabalhos, setTrabalhos] = useState<any[]>([]);
  const [palavrasChave, setPalavrasChave] = useState<string[]>([]);
  const [tiposPublicacao, setTiposPublicacao] = useState<string[]>([]);
  const [filtrosPalavras, setFiltrosPalavras] = useState<string[]>([]);
  const [filtrosTipos, setFiltrosTipos] = useState<string[]>([]);
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());

  // Modal para citações
  const [modalAberto, setModalAberto] = useState(false);
  const [modalDOIs, setModalDOIs] = useState<string[]>([]); // DOIs para modal (1 ou vários)
  const [citacoesModal, setCitacoesModal] = useState<Record<string, Citation[]>>({});
  const [loadingCitacoesModal, setLoadingCitacoesModal] = useState(false);
  const [citacoesPorEstilo, setCitacoesPorEstilo] = useState<Record<string, Citation[]>>({});


  // Buscar trabalhos e metadados
  useEffect(() => {
    if (!orcid) return;

    fetch(`https://pub.orcid.org/v3.0/${orcid}/works`, {
      headers: { Accept: "application/json" },
    })
      .then(res => res.json())
      .then(data => {
        setTrabalhos(data.group || []);
        const tipos = new Set<string>();
        (data.group || []).forEach(t => {
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
        const palavras: string[] = data?.keywords?.keyword?.map((k: { content: string }) => k.content) || [];
        setPalavrasChave(palavras);
      });
  }, [orcid]);

  // Toggle filtros
  const toggleFiltroPalavra = (p: string) => {
    setFiltrosPalavras(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
  };
  const toggleFiltroTipo = (t: string) => {
    setFiltrosTipos(prev =>
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    );
  };

  // Toggle seleção trabalho
  const toggleSelecionado = (doi: string) => {
    setSelecionados(prev => {
      const novo = new Set(prev);
      if (novo.has(doi)) novo.delete(doi);
      else novo.add(doi);
      return novo;
    });
  };

  // Filtra trabalhos
  const trabalhosFiltrados = trabalhos.filter(t => {
    const summary = t?.["work-summary"]?.[0];
    if (!summary) return false;
    const titulo = summary?.title?.title?.value?.toLowerCase() || "";
    const tipo = summary?.type || "";

    const passouPalavra =
      filtrosPalavras.length === 0 ||
      filtrosPalavras.some(p => titulo.includes(p.toLowerCase()));

    const passouTipo =
      filtrosTipos.length === 0 || filtrosTipos.includes(tipo);

    return passouPalavra && passouTipo;
  });

  // --- Função que busca citações CiteAs para um DOI ---
  async function fetchCitations(doi: string): Promise<Citation[]> {
    try {
      const url = `https://api.citeas.org/product/${encodeURIComponent(doi)}?email=${encodeURIComponent(email)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Erro CiteAs");
      const data = await res.json();
      return data.citations || [];
    } catch {
      return [];
    }
  }

  // Abre modal para 1 DOI
  const abrirModalUmDOI = async (doi: string) => {
    setLoadingCitacoesModal(true);
    setModalAberto(true);
    setModalDOIs([doi]);
    const cit = await fetchCitations(doi);
    setCitacoesModal({ [doi]: cit });
    setLoadingCitacoesModal(false);
  };

  // Abre modal para múltiplos DOIs selecionados
  const abrirModalMultiDOIs = async () => {
  if (selecionados.size === 0) return;
  setLoadingCitacoesModal(true);
  setModalAberto(true);
  const doiArray = Array.from(selecionados);
  setModalDOIs(doiArray);

  // Busca citações para cada DOI
  const todasCitacoes: Citation[] = [];
  for (const d of doiArray) {
    const cits = await fetchCitations(d);
    todasCitacoes.push(...cits);
  }

  const agrupado: Record<string, Citation[]> = {};
  todasCitacoes.forEach(c => {
    if (!agrupado[c.style_shortname]) agrupado[c.style_shortname] = [];
    agrupado[c.style_shortname].push(c);
  });

  setCitacoesPorEstilo(agrupado);
  setLoadingCitacoesModal(false);
};


  // Baixar .bib da citação escolhida
  const baixarBib = (doi: string, citation: Citation) => {
    const bibContent = `%% Estilo: ${citation.style_fullname} (${citation.style_shortname})\n${citation.citation}`;
    const blob = new Blob([bibContent], { type: "text/x-bibtex" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${doi.replace(/\//g, "_")}_${citation.style_shortname}.bib`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Nova função para baixar arquivo .bib único com todas citações do estilo escolhido
const baixarBibMulti = (styleShortname: string) => {
  const cits = citacoesPorEstilo[styleShortname];
  if (!cits || cits.length === 0) return;

  // Junta todas as citações desse estilo, colocando um comentário com o nome do estilo no começo
  const bibContent = `%% Estilo: ${cits[0].style_fullname} (${styleShortname})\n\n` +
    cits.map(c => c.citation).join('\n\n');

  const blob = new Blob([bibContent], { type: "text/x-bibtex" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `citacoes_selecionadas_${styleShortname}.bib`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  // Modal UI simples
  const Modal = () => {
  if (!modalAberto) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        overflowY: "auto"
      }}
      onClick={() => setModalAberto(false)}
    >
      <div
        style={{
          background: "white",
          padding: 20,
          maxWidth: 400,
          maxHeight: "80vh",
          overflowY: "auto",
          borderRadius: 8,
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2>Estilos disponíveis para baixar</h2>

        {loadingCitacoesModal && <p>Carregando citações...</p>}

        {!loadingCitacoesModal && Object.keys(citacoesPorEstilo).length === 0 && (
          <p>Nenhuma citação encontrada para os trabalhos selecionados.</p>
        )}

        {!loadingCitacoesModal && Object.entries(citacoesPorEstilo).map(([style, cits]) => (
          <div key={style} style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{cits[0].style_fullname}</span>
            <Button size="sm" onClick={() => baixarBibMulti(style)}>Baixar .bib</Button>
          </div>
        ))}

        <Button variant="outline" onClick={() => setModalAberto(false)}>Fechar</Button>
      </div>
    </div>
  );
};

  return (
    <Layout>
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold mb-4">Trabalhos do ORCID {orcid}</h1>

        {/* Filtros separados */}
        <div>
          <h3 className="font-semibold">Filtrar por palavras-chave:</h3>
          <div className="flex flex-wrap gap-3 mb-4">
            {palavrasChave.map(p => (
              <Button
                key={p}
                variant={filtrosPalavras.includes(p) ? "default" : "outline"}
                onClick={() => toggleFiltroPalavra(p)}
              >
                {p}
              </Button>
            ))}
          </div>

          <h3 className="font-semibold">Filtrar por tipo de publicação:</h3>
          <div className="flex flex-wrap gap-3 mb-6">
            {tiposPublicacao.map(t => (
              <Button
                key={t}
                variant={filtrosTipos.includes(t) ? "default" : "outline"}
                onClick={() => toggleFiltroTipo(t)}
              >
                {t}
              </Button>
            ))}
          </div>
        </div>

        <Button
          onClick={abrirModalMultiDOIs}
          disabled={selecionados.size === 0}
          className="mb-6"
        >
          Baixar citações selecionadas (.bib)
        </Button>

        {trabalhosFiltrados.length === 0 && <p>Nenhum trabalho encontrado.</p>}

        {trabalhosFiltrados.map((t, idx) => {
          const summary = t["work-summary"][0];
          const dois: ExternalId[] = summary["external-ids"]?.["external-id"] || [];
          const doi = dois.find(id => id["external-id-type"] === "doi")?.["external-id-value"];
          const titulo = summary.title.title.value || "Sem título";
          const tipo = summary.type || "N/A";
          const ano = summary["publication-date"]?.year?.value || "N/A";

          const isSelecionado = doi ? selecionados.has(doi) : false;

          return (
            <Card key={idx} className="mb-4">
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">{titulo}</h3>
                  <Checkbox
                    checked={isSelecionado}
                    onCheckedChange={() => doi && toggleSelecionado(doi)}
                    aria-label="Selecionar trabalho"
                  />
                </div>

                <p><strong>Tipo:</strong> {tipo} | <strong>Ano:</strong> {ano}</p>
                {doi && <p><strong>DOI:</strong> {doi}</p>}

                <div className="mt-2 space-x-2">
                  <Button size="sm" onClick={() => abrirModalUmDOI(doi)}>Citações CiteAs</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

      </div>

      <Modal />
    </Layout>
  );
};

export default Trabalhos;
