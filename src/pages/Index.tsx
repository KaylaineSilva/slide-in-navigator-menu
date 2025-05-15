
import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PencilIcon, FileText } from "lucide-react";

const Index = () => {
  return (
    <Layout>
      <div className="mb-8 pt-8 lg:pt-0">
        {/* Cabeçalho ORCID */}
        <div className="mb-6 grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                      ID
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">https://orcid.org/</p>
                      <p className="font-bold text-lg">0009-0007-1891-2250</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2 text-blue-500 border-blue-300">
                    Pré-visualizar o registro público
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex gap-3 items-center">
                <div className="text-green-600">
                  <FileText size={24} />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">Trabalhos acadêmicos</h2>
                  <p className="text-sm">Visualize todos os trabalhos deste perfil</p>
                </div>
              </div>
              <Link to="/trabalhos">
                <Button className="bg-green-600 hover:bg-green-700">
                  Ver trabalhos
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Seções de Informações */}
        <div className="space-y-6">
          {/* Seção de Nomes */}
          <section id="perfil" className="scroll-mt-16">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Nomes</h2>
                  <Button variant="ghost" size="icon">
                    <PencilIcon className="h-5 w-5" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Nome</p>
                      <p className="font-medium">Kaylaine Bessa da Silva</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10"></path><path d="M16 2v4"></path><path d="M8 2v4"></path><path d="M3 10h18"></path><path d="m17 21 2 2 4-4"></path></svg>
                      Visível
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Seção E-mails e domínios */}
          <section id="emails" className="scroll-mt-16">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">E-mails e domínios</h2>
                  <Button variant="ghost" size="icon">
                    <PencilIcon className="h-5 w-5" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Endereços de e-mail</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <p>kaylaine74.silva@gmail.com</p>
                        <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                          Privado
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <p>kaylaine.bessasilva@usp.br</p>
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10"></path><path d="M16 2v4"></path><path d="M8 2v4"></path><path d="M3 10h18"></path><path d="m17 21 2 2 4-4"></path></svg>
                          Visível
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-2">Domínios de e-mail verificados</p>
                    <div className="flex justify-between">
                      <p>usp.br</p>
                      <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10"></path><path d="M16 2v4"></path><path d="M8 2v4"></path><path d="M3 10h18"></path><path d="m17 21 2 2 4-4"></path></svg>
                        Visível
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Seção Biografia */}
          <section id="biografia" className="scroll-mt-16">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Biografia</h2>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8"></path><path d="M3 16.2V21m0-4.8H7.8"></path><path d="M21 7.8V3m0 4.8h-4.8"></path><path d="M7.8 3H3v4.8"></path></svg>
                        Todos
                      </Badge>
                    </div>
                    <Button variant="ghost" size="icon">
                      <PencilIcon className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Seção Atividades */}
          <div id="atividades" className="flex justify-between items-center mb-2 scroll-mt-16">
            <h2 className="text-xl font-semibold">Atividades</h2>
            <Button variant="link" className="text-blue-500">Expandir tudo</Button>
          </div>

          {/* Seção Emprego */}
          <section id="emprego" className="scroll-mt-16">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10 22a2 2 0 0 0 4 0"></path></svg>
                    <h3 className="text-lg font-medium">Emprego (0)</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-500">Classificar</Button>
                    <Button size="sm">Adicionar</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Seção Educação */}
          <section id="educacao" className="scroll-mt-16">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10 22a2 2 0 0 0 4 0"></path></svg>
                    <h3 className="text-lg font-medium">Educação e qualificações (0)</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-500">Classificar</Button>
                    <Button size="sm">Adicionar</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Seção Atividades Profissionais */}
          <section id="atividades-profissionais" className="scroll-mt-16">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10 22a2 2 0 0 0 4 0"></path></svg>
                    <h3 className="text-lg font-medium">Atividades profissionais (0)</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-500">Classificar</Button>
                    <Button size="sm">Adicionar</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Seção Financiamento */}
          <section id="financiamento" className="scroll-mt-16">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10 22a2 2 0 0 0 4 0"></path></svg>
                    <h3 className="text-lg font-medium">Financiamento (0)</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-500">Classificar</Button>
                    <Button size="sm">Adicionar</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Seção Trabalhos */}
          <section id="trabalhos" className="scroll-mt-16">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10 22a2 2 0 0 0 4 0"></path></svg>
                    <h3 className="text-lg font-medium">Trabalhos (0)</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-500">Classificar</Button>
                    <Button size="sm">Adicionar</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
