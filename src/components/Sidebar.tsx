
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  User, 
  Mail, 
  Globe, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Award, 
  X 
} from "lucide-react";

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const menuItems = [
    { icon: User, label: "Perfil", href: "#perfil" },
    { icon: Mail, label: "E-mails e domínios", href: "#emails" },
    { icon: FileText, label: "Biografia", href: "#biografia" },
    { icon: Briefcase, label: "Emprego", href: "#emprego" },
    { icon: GraduationCap, label: "Educação e qualificações", href: "#educacao" },
    { icon: Award, label: "Atividades profissionais", href: "#atividades" },
    { icon: Globe, label: "Financiamento", href: "#financiamento" },
    { icon: FileText, label: "Trabalhos", href: "#trabalhos" }
  ];

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-full w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        <h2 className="text-lg font-semibold text-gray-800">ORCID Menu</h2>
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden rounded-md p-1 hover:bg-gray-100"
          aria-label="Fechar menu"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="mt-4">
        <ul className="space-y-2 px-4">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.href}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600"
                onClick={() => setIsOpen(false)}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
