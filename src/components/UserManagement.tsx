import { useState, useEffect } from "react";
import { Users, Plus, Trash2, ShieldAlert, Loader2, Mail } from "lucide-react";
import { AuthorizedUser } from "../types";

export default function UserManagement() {
  const [users, setUsers] = useState<AuthorizedUser[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Load authorized users from API endpoint
  useEffect(() => {
    let active = true;
    const loadUsers = async () => {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("Failed to fetch");
        const list = await res.json();
        if (active) {
          // Ensure our default admin is always in the view list
          const hasAdmin = list.some((u: any) => u.email === "gerlianemagalhaes79@gmail.com");
          if (!hasAdmin) {
            list.unshift({
              email: "gerlianemagalhaes79@gmail.com",
              role: "admin",
              addedBy: "System",
              createdAt: new Date().toISOString(),
            });
          }
          setUsers(list.sort((a: any, b: any) => a.email.localeCompare(b.email)));
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Erro ao carregar usuários autorizados:", err);
        if (active) {
          setError("Não foi possível carregar a lista de usuários autorizados.");
          setIsLoading(false);
        }
      }
    };
    
    loadUsers();
    const interval = setInterval(loadUsers, 10000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const emailToUse = newEmail.trim().toLowerCase();
    if (!emailToUse) {
      setError("Por favor, informe um e-mail válido.");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailToUse)) {
      setError("Por favor, insira um e-mail com formato válido (ex: nome@email.com).");
      return;
    }

    // Check if already in list
    if (users.some((u) => u.email === emailToUse)) {
      setError("Este usuário já possui acesso autorizado.");
      return;
    }

    setIsAdding(true);
    try {
      const storedUser = localStorage.getItem("aprova_user");
      const addedBy = storedUser ? JSON.parse(storedUser).email : "gerlianemagalhaes79@gmail.com";

      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToUse, role: "user", addedBy })
      });
      if (!res.ok) throw new Error("Falha ao salvar");
      
      const savedUser = await res.json();
      setUsers(prev => [...prev.filter(u => u.email !== emailToUse), {
        email: savedUser.email,
        role: savedUser.role,
        addedBy: savedUser.addedBy,
        createdAt: savedUser.createdAt
      }].sort((a, b) => a.email.localeCompare(b.email)));

      setNewEmail("");
      setSuccessMsg(`Usuário ${emailToUse} adicionado com sucesso!`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error("Erro ao adicionar usuário:", err);
      setError("Permissão negada ou erro ao salvar o usuário. Certifique-se de que sua conta possui acesso de administrador.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteUser = async (email: string) => {
    if (email === "gerlianemagalhaes79@gmail.com") {
      alert("Não é possível remover o administrador principal do sistema.");
      return;
    }

    if (!confirm(`Tem certeza que deseja revogar o acesso do usuário ${email}?`)) {
      return;
    }

    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch(`/api/users/${encodeURIComponent(email)}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Falha ao deletar");
      
      setUsers(prev => prev.filter(u => u.email !== email));
      setSuccessMsg(`Acesso de ${email} revogado com sucesso!`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error("Erro ao remover usuário:", err);
      setError("Erro ao revogar o acesso do usuário. Verifique suas permissões.");
    }
  };

  return (
    <div id="user-management-section" className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-brand-light-navy rounded-xl text-brand-navy">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-brand-navy font-display">Gerenciamento de Acessos</h2>
            <p className="text-xs text-slate-500">Adicione ou remova contas do Google autorizadas a acessar a plataforma.</p>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-[11px] px-3 py-1.5 rounded-lg font-bold">
          <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0" />
          <span>Apenas e-mails liberados podem efetuar login</span>
        </div>
      </div>

      {/* Grid: Form and List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-800">Liberar Novo Acesso</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Insira o e-mail associado à Conta Google da pessoa para a qual deseja conceder acesso preparatório.
          </p>

          <form onSubmit={handleAddUser} className="space-y-3">
            <div className="space-y-1">
              <label htmlFor="user-email-input" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                E-mail da Conta Google
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  id="user-email-input"
                  type="email"
                  placeholder="exemplo@gmail.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-bold border border-red-100 flex items-start gap-2 animate-shake">
                <ShieldAlert className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl font-bold border border-emerald-100">
                {successMsg}
              </div>
            )}

            <button
              id="add-user-btn"
              type="submit"
              disabled={isAdding}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand-navy hover:bg-brand-navy/90 text-white rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isAdding ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Salvando Usuário...</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Conceder Acesso</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* List Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800">Usuários Autorizados ({users.length})</h3>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin text-brand-navy" />}
          </div>

          <div className="border border-slate-100 rounded-2xl overflow-hidden max-h-[300px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Conta / E-mail</th>
                  <th className="py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Função</th>
                  <th className="py-3 px-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.email} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-xs font-bold text-slate-700">{user.email}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        user.email === "gerlianemagalhaes79@gmail.com" 
                          ? "bg-purple-100 text-purple-700" 
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {user.email === "gerlianemagalhaes79@gmail.com" ? "Administrador" : "Usuário"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {user.email !== "gerlianemagalhaes79@gmail.com" ? (
                        <button
                          onClick={() => handleDeleteUser(user.email)}
                          title="Revogar Acesso"
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer inline-flex items-center justify-center"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      ) : (
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide px-2 select-none">
                          Inviolável
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Nenhum usuário cadastrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
