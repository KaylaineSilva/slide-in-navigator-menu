import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";

const Trabalhos = () => {
  const location = useLocation();
  const [trabalhos, setTrabalhos] = useState([]);
  const [palavrasChave, setPalavrasChave] = useState<string[]>([]);
  const [tiposPublicacao, setTiposPublicacao] = useState<string[]>([]);
  const [filtrosSelecionados, setFiltrosSelecionados] = useState<string[]>([]);

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

  // Função para lidar com mudança nos filtros
  const toggleFiltro = (valor: string) => {
    setFiltrosSelecionados(prev =>
      prev.includes(valor) ? prev.filter(f => f !== valor) : [...prev, valor]
    );
  };

  // Aplicar filtros: título inclui palavra OU tipo corresponde
  const palavrasSelecionadas = filtrosSelecionados.filter(f => palavrasChave.includes(f));
const tiposSelecionados = filtrosSelecionados.filter(f => tiposPublicacao.includes(f));

const trabalhosFiltrados = trabalhos.filter(t => {
  const summary = t?.["work-summary"]?.[0];
  const titulo = summary?.title?.title?.value?.toLowerCase() || "";
  const tipo = summary?.type || "";

  // Filtro por palavras-chave (OR dentro do grupo)
  const passouPalavra =
    palavrasSelecionadas.length === 0 ||
    palavrasSelecionadas.some(p => titulo.includes(p.toLowerCase()));

  // Filtro por tipo (OR dentro do grupo)
  const passouTipo =
    tiposSelecionados.length === 0 || tiposSelecionados.includes(tipo);

  // AND entre grupos
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

              return (
                <Card key={idx}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{titulo || "Sem título"}</p>
                        {ano && <p className="text-sm text-gray-500">Publicado em {ano}</p>}
                      </div>
                      {tipo && (
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 capitalize">
                          {tipo.replace(/-/g, " ")}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-600 mt-4">Nenhum trabalho encontrado com os filtros aplicados.</p>
        )}
      </div>
    </Layout>
  );
};

export default Trabalhos;
