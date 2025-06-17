import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PencilIcon,
  FileText,
  BookOpen,
  UserIcon,
  MapPin,
  Tag,
  Users,
} from "lucide-react";

const Index = () => {
  const [orcidId, setOrcidId] = useState("");
  const [inputOrcid, setInputOrcid] = useState("");
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [biografia, setBiografia] = useState("");
  const [outrosNomes, setOutrosNomes] = useState([]);
  const [palavrasChave, setPalavrasChave] = useState([]);
  const [enderecos, setEnderecos] = useState([]);
  const [afiliacoes, setAfiliacoes] = useState([]);
  const [emails, setEmails] = useState([]);
  const [empregos, setEmpregos] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const fetchORCIDData = async (id: string) => {
    try {
      sessionStorage.setItem("orcid", id);
      navigate(`/?orcid=${id}`);

      const personRes = await fetch(`https://pub.orcid.org/v3.0/${id}/person`, {
        headers: { Accept: "application/json" },
      });
      const personData = await personRes.json();

      setOrcidId(id);
      setNome(personData?.name?.["given-names"]?.value || "");
      setSobrenome(personData?.name?.["family-name"]?.value || "");
      setBiografia(personData?.biography?.content || "");
      setOutrosNomes(personData?.["other-names"]?.["other-name"] || []);
      setPalavrasChave(
        personData?.keywords?.keyword?.map((k) => k?.content) || []
      );
      setEnderecos(personData?.addresses?.address || []);
      setEmails(personData?.emails?.email || []);

      const empRes = await fetch(
        `https://pub.orcid.org/v3.0/${id}/employments`,
        {
          headers: { Accept: "application/json" },
        }
      );
      const empData = await empRes.json();

      const empregosExtraidos =
        empData?.["affiliation-group"]?.flatMap((grupo) =>
          grupo?.summaries?.map((s) => s?.["employment-summary"])
        ) || [];
      setEmpregos(empregosExtraidos);
      setAfiliacoes(empregosExtraidos);
      console.log(empregosExtraidos);
    } catch (error) {
      console.error("Erro ao buscar dados do ORCID:", error);
      alert("Erro ao buscar o ORCID informado.");
    }
  };

  // Executa ao carregar
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orcidFromUrl = params.get("orcid");
    const orcidFromSession = sessionStorage.getItem("orcid");

    if (orcidFromUrl) {
      fetchORCIDData(orcidFromUrl);
      setInputOrcid(orcidFromUrl);
    } else if (orcidFromSession) {
      fetchORCIDData(orcidFromSession);
      setInputOrcid(orcidFromSession);
    }
  }, []);

  return (
    <Layout>
      <div className="mb-8 pt-8 lg:pt-0">
        {/* Input */}
        <div className="mb-6 flex gap-4 items-center">
          <input
            type="text"
            placeholder="Digite o código ORCID"
            value={inputOrcid}
            onChange={(e) => setInputOrcid(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md w-full max-w-md"
          />
          <Button onClick={() => fetchORCIDData(inputOrcid)}>Buscar</Button>
        </div>

        {/* Cartões */}
        {orcidId && (
          <>
            {/* ORCID */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                        ID
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          https://orcid.org/
                        </p>
                        <p className="font-bold text-lg">{orcidId}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 text-blue-500 border-blue-300">
                      Pré-visualizar o registro público
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <section className="scroll-mt-16 mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-semibold">Nomes</h2>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Nome</p>
                      <p className="font-medium">
                        {nome} {sobrenome}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-600 border-green-200">
                      Visível
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="scroll-mt-16 mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-semibold flex gap-2 items-center">
                      <UserIcon size={20} /> Outros nomes
                    </h2>
                  </div>
                  <ul className="list-disc pl-5">
                    {outrosNomes.length > 0 ? (
                      outrosNomes.map((nome, idx) => (
                        <li key={idx}>{nome.content}</li>
                      ))
                    ) : (
                      <li>Nenhum nome alternativo cadastrado.</li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section className="scroll-mt-16 mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-semibold flex gap-2 items-center">
                      <UserIcon size={20} /> E-mails
                    </h2>
                  </div>
                  <ul className="list-disc pl-5">
                    {emails.length > 0 ? (
                      emails.map((email, idx) => (
                        <li key={idx}>
                          {email.email} {email.primary && "(principal)"}
                        </li>
                      ))
                    ) : (
                      <li>Nenhum e-mail registrado.</li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </section>

            {/* Trabalhos */}
            <Card className="border-green-200 bg-green-50 mt-6">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <div className="text-green-600">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg">
                      Trabalhos acadêmicos
                    </h2>
                    <p className="text-sm">
                      Visualize todos os trabalhos deste perfil
                    </p>
                  </div>
                </div>
                <Link to={`/trabalhos?orcid=${orcidId}`}>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Ver trabalhos
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Seções */}

            <section className="scroll-mt-16 mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-semibold flex gap-2 items-center">
                      <BookOpen size={20} /> Biografia
                    </h2>
                  </div>
                  <p>{biografia || "Nenhuma biografia disponível."}</p>
                </CardContent>
              </Card>
            </section>

            <section className="scroll-mt-16 mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-semibold flex gap-2 items-center">
                      <Tag size={20} /> Palavras-chave
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {palavrasChave.length > 0 ? (
                      palavrasChave.map((palavra, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="bg-green-50 text-green-600 border-green-200">
                          {palavra}
                        </Badge>
                      ))
                    ) : (
                      <p>Nenhuma palavra-chave informada.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="scroll-mt-16 mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-semibold flex gap-2 items-center">
                      <MapPin size={20} /> Endereços
                    </h2>
                  </div>
                  <ul className="list-disc pl-5">
                    {enderecos.length > 0 ? (
                      enderecos.map((end, idx) => (
                        <li key={idx}>{end?.country?.value}</li>
                      ))
                    ) : (
                      <li>Nenhum endereço registrado.</li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section className="scroll-mt-16 mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-semibold flex gap-2 items-center">
                      <Users size={20} /> Empregos
                    </h2>
                  </div>
                  <ul className="list-disc pl-5">
                    {empregos.length > 0 ? (
                      empregos.map((emp, idx) => {
                        const org =
                          emp?.organization?.name ||
                          "Organização não informada";
                        const cargo =
                          emp?.["role-title"]?.trim() || "Cargo não informado";
                        const inicio = emp?.["start-date"]?.year?.value || "?";
                        const fim = emp?.["end-date"]?.year?.value || "Atual";
                        const cidade = emp?.organization?.address?.city;
                        const pais = emp?.organization?.address?.country;

                        return (
                          <li key={idx}>
                            <span className="font-medium">{org}</span> — {cargo}{" "}
                            ({inicio} - {fim})
                            {cidade || pais ? (
                              <span className="text-sm text-gray-600">
                                {" "}
                                — {cidade ? `${cidade}, ` : ""}
                                {pais || ""}
                              </span>
                            ) : null}
                          </li>
                        );
                      })
                    ) : (
                      <li>Nenhum emprego registrado.</li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section className="scroll-mt-16 mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-semibold flex gap-2 items-center">
                      <Users size={20} /> Afiliações
                    </h2>
                  </div>
                  <ul className="list-disc pl-5">
                    {afiliacoes.length > 0 ? (
                      afiliacoes.map((afil, idx) => (
                        <li key={idx}>{afil?.organization?.name}</li>
                      ))
                    ) : (
                      <li>Nenhuma afiliação encontrada.</li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </section>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Index;
