
import React, { useState } from "react";
import Layout from "../components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Example data format for works
type Trabalho = {
  id: number;
  titulo: string;
  autores: string;
  data: string;
  keywords: string[];
};

const trabalhosExemplo: Trabalho[] = [
  {
    id: 1,
    titulo: "Aplicações de Machine Learning em Biotecnologia",
    autores: "Silva K., Oliveira M., Santos P.",
    data: "2024-03-15",
    keywords: ["machine learning", "biotecnologia", "inteligência artificial"],
  },
  {
    id: 2,
    titulo: "Avanços Recentes em Química Orgânica",
    autores: "Ferreira A., Silva K., Costa L.",
    data: "2023-11-20",
    keywords: ["química orgânica", "síntese", "reações catalíticas"],
  },
  {
    id: 3,
    titulo: "Sistemas Sustentáveis para Cidades Inteligentes",
    autores: "Martins R., Silva K., Pereira J.",
    data: "2023-08-05",
    keywords: ["sustentabilidade", "cidades inteligentes", "urbanismo"],
  },
  {
    id: 4,
    titulo: "Impacto da Tecnologia na Educação Superior",
    autores: "Silva K., Rodrigues C.",
    data: "2023-05-12",
    keywords: ["educação", "tecnologia", "ensino superior"],
  },
];

const Trabalhos = () => {
  const [keywordFilter, setKeywordFilter] = useState("");
  const [trabalhosFiltrados, setTrabalhosFiltrados] = useState<Trabalho[]>(trabalhosExemplo);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filter = e.target.value.toLowerCase();
    setKeywordFilter(filter);
    
    if (!filter) {
      setTrabalhosFiltrados(trabalhosExemplo);
      return;
    }
    
    const filtered = trabalhosExemplo.filter(trabalho => 
      trabalho.keywords.some(keyword => keyword.toLowerCase().includes(filter)) ||
      trabalho.titulo.toLowerCase().includes(filter)
    );
    
    setTrabalhosFiltrados(filtered);
  };

  return (
    <Layout>
      <div className="pt-16 lg:pt-6">
        <h1 className="text-2xl font-bold mb-6">Trabalhos</h1>
        
        <div className="relative mb-6">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Filtrar por palavra-chave..."
            value={keywordFilter}
            onChange={handleFilterChange}
            className="pl-9"
          />
        </div>
        
        <div className="space-y-4">
          {trabalhosFiltrados.length > 0 ? (
            trabalhosFiltrados.map((trabalho) => (
              <Card key={trabalho.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg">{trabalho.titulo}</h3>
                  <p className="text-sm text-gray-600">Autores: {trabalho.autores}</p>
                  <p className="text-sm text-gray-600">
                    Data: {new Date(trabalho.data).toLocaleDateString('pt-BR')}
                  </p>
                  <div className="mt-2">
                    <span className="text-xs font-medium text-gray-600">Keywords: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {trabalho.keywords.map((keyword, idx) => (
                        <span 
                          key={idx} 
                          className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-10">
              <p>Nenhum trabalho encontrado com os critérios de busca.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Trabalhos;
