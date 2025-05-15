
import React, { useState } from "react";
import Layout from "../components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, User, FileText } from "lucide-react";

const Busca = () => {
  const [orcidSearch, setOrcidSearch] = useState("");
  const [keywordSearch, setKeywordSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("perfil");
  const [isSearching, setIsSearching] = useState(false);

  const handleOrcidSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    // Simulação de busca por ORCID
    setTimeout(() => {
      if (orcidSearch.trim()) {
        setSearchResults([
          {
            id: 1,
            orcid: "0009-0007-1891-2250",
            nome: "Kaylaine Bessa da Silva",
            instituicao: "Universidade de São Paulo",
            area: "Biotecnologia"
          },
          {
            id: 2,
            orcid: "0001-2345-6789-0123",
            nome: "Pedro Henrique Santos",
            instituicao: "Universidade Federal do Rio de Janeiro",
            area: "Física Quântica"
          }
        ]);
      } else {
        setSearchResults([]);
      }
      setIsSearching(false);
    }, 500);
  };

  const handleKeywordSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    // Simulação de busca por keywords
    setTimeout(() => {
      if (keywordSearch.trim()) {
        setSearchResults([
          {
            id: 1,
            titulo: "Aplicações de Inteligência Artificial em Bioinformática",
            autores: "Silva K., Oliveira M., Santos P.",
            data: "2024-02-10",
            keywords: ["inteligência artificial", "bioinformática", "genômica"]
          },
          {
            id: 2,
            titulo: "Análise Computacional de Estruturas Proteicas",
            autores: "Ferreira A., Costa L.",
            data: "2023-11-05",
            keywords: ["proteínas", "bioinformática", "modelagem molecular"]
          },
          {
            id: 3,
            titulo: "Algoritmos de Aprendizado de Máquina na Identificação de Padrões Genéticos",
            autores: "Martins R., Silva K., Pereira J.",
            data: "2023-05-20",
            keywords: ["machine learning", "genética", "bioinformática"]
          }
        ]);
      } else {
        setSearchResults([]);
      }
      setIsSearching(false);
    }, 500);
  };

  return (
    <Layout>
      <div className="pt-16 lg:pt-6">
        <h1 className="text-2xl font-bold mb-6">Busca</h1>
        
        <Tabs defaultValue="perfil" value={activeTab} onValueChange={setActiveTab} className="w-full">
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
          
          <TabsContent value="perfil" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleOrcidSearch} className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input 
                      type="text" 
                      placeholder="Buscar ORCID (ex: 0000-0000-0000-0000)" 
                      value={orcidSearch}
                      onChange={(e) => setOrcidSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Button type="submit" disabled={isSearching}>Buscar</Button>
                </form>
              </CardContent>
            </Card>
            
            {activeTab === "perfil" && searchResults.length > 0 && (
              <div className="space-y-4 mt-4">
                {searchResults.map((result: any) => (
                  <Card key={result.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold mr-3">
                          {result.nome.split(' ').map((name: string) => name[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-semibold">{result.nome}</h3>
                          <p className="text-sm text-gray-600">ORCID: {result.orcid}</p>
                          <p className="text-sm text-gray-600">Instituição: {result.instituicao}</p>
                          <p className="text-sm text-gray-600">Área: {result.area}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="artigos" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleKeywordSearch} className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input 
                      type="text" 
                      placeholder="Buscar por palavras-chave..." 
                      value={keywordSearch}
                      onChange={(e) => setKeywordSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Button type="submit" disabled={isSearching}>Buscar</Button>
                </form>
              </CardContent>
            </Card>
            
            {activeTab === "artigos" && searchResults.length > 0 && (
              <div className="space-y-4 mt-4">
                {searchResults.map((result: any) => (
                  <Card key={result.id}>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{result.titulo}</h3>
                      <p className="text-sm text-gray-600">Autores: {result.autores}</p>
                      <p className="text-sm text-gray-600">
                        Data: {new Date(result.data).toLocaleDateString('pt-BR')}
                      </p>
                      <div className="mt-2">
                        <span className="text-xs font-medium text-gray-600">Keywords: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {result.keywords.map((keyword: string, idx: number) => (
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
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Busca;
