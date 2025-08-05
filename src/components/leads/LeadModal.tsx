import { Lead, Consultor } from '@/types/lead';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  Phone, 
  Building2, 
  TrendingUp, 
  FileText, 
  Calendar, 
  Users, 
  Hash,
  MapPin 
} from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { leadsApi } from '@/services/api';

interface LeadModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onLeadUpdate: (updatedLead: Lead) => void;
}

// Mock data for consultors - in a real app, this would come from API
const mockConsultors: Consultor[] = [
  { id: '1', nome: 'Ana Silva', email: 'ana@falavinha.com.br', ativo: true },
  { id: '2', nome: 'João Santos', email: 'joao@falavinha.com.br', ativo: true },
  { id: '3', nome: 'Maria Oliveira', email: 'maria@falavinha.com.br', ativo: true },
  { id: '4', nome: 'Pedro Costa', email: 'pedro@falavinha.com.br', ativo: true },
];

export function LeadModal({ lead, isOpen, onClose, onLeadUpdate }: LeadModalProps) {
  const [selectedConsultor, setSelectedConsultor] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState(false);
  const { toast } = useToast();

  if (!lead) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatPhone = (phone: string | undefined | null) => {
    if (!phone) return 'Telefone não informado';
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleAssignConsultor = async () => {
    if (!selectedConsultor) return;
    
    setIsAssigning(true);
    try {
      await leadsApi.assignConsultor(lead.id, selectedConsultor);
      const consultor = mockConsultors.find(c => c.id === selectedConsultor);
      onLeadUpdate({ 
        ...lead, 
        consultorId: selectedConsultor,
        consultorNome: consultor?.nome 
      });
      toast({
        title: "Consultor atribuído",
        description: `Lead atribuído para ${consultor?.nome} com sucesso.`,
        variant: "default",
      });
      setSelectedConsultor('');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atribuir o consultor.",
        variant: "destructive",
      });
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-foreground">
              Detalhes do Lead
            </DialogTitle>
            <Badge variant={lead.ativo ? 'active' : 'inactive'}>
              {lead.ativo ? 'Ativo' : 'Inativo'}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Informações Básicas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-foreground">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="font-medium">Nome</span>
                </div>
                <p className="text-foreground pl-6">{lead.nome}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-foreground">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="font-medium">Email</span>
                </div>
                <p className="text-foreground pl-6">{lead.email}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-foreground">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="font-medium">Telefone</span>
                </div>
                <p className="text-foreground pl-6">{formatPhone(lead.telefone)}</p>
              </div>

              {lead.cnpj && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-foreground">
                    <Hash className="h-4 w-4 text-primary" />
                    <span className="font-medium">CNPJ</span>
                  </div>
                  <p className="text-foreground pl-6">{lead.cnpj}</p>
                </div>
              )}
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Informações Empresariais */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Informações Empresariais</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-foreground">
                  <Building2 className="h-4 w-4 text-primary" />
                  <span className="font-medium">Segmento</span>
                </div>
                <p className="text-foreground pl-6">{lead.segmento}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-foreground">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="font-medium">Regime Tributário</span>
                </div>
                <p className="text-foreground pl-6">{lead.regimeTributario}</p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center gap-2 text-foreground">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="font-medium">Faturamento Anual</span>
                </div>
                <p className="text-xl font-semibold text-primary pl-6">
                  {formatCurrency(lead.faturamentoAnual)}
                </p>
              </div>
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Informações de Sistema */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Informações de Sistema</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-foreground">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="font-medium">Data de Cadastro</span>
                </div>
                <p className="text-foreground pl-6">{formatDate(lead.dataCadastro)}</p>
              </div>

              {lead.dataAtualizacao && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-medium">Última Atualização</span>
                  </div>
                  <p className="text-foreground pl-6">{formatDate(lead.dataAtualizacao)}</p>
                </div>
              )}
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Atribuição de Consultor */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Atribuição de Consultor</h3>
            
            {lead.consultorNome ? (
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="font-medium text-foreground">Consultor Atual:</span>
                  <span className="text-foreground">{lead.consultorNome}</span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-muted/50 rounded-lg border border-border">
                <p className="text-muted-foreground mb-2">Nenhum consultor atribuído</p>
              </div>
            )}

            <div className="flex gap-2">
              <Select value={selectedConsultor} onValueChange={setSelectedConsultor}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Selecionar consultor" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {mockConsultors.map((consultor) => (
                    <SelectItem key={consultor.id} value={consultor.id}>
                      {consultor.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={handleAssignConsultor}
                disabled={!selectedConsultor || isAssigning}
                className="bg-gradient-primary hover:opacity-80"
              >
                {isAssigning ? 'Atribuindo...' : 'Atribuir'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}