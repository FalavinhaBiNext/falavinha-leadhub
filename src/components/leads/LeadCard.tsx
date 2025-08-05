import { useState } from 'react';
import { Lead } from '@/types/lead';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Mail, Phone, Building2, TrendingUp, FileText, Users, MoreVertical, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { leadsApi } from '@/services/api';

interface LeadCardProps {
  lead: Lead;
  onLeadUpdate: (updatedLead: Lead) => void;
  onViewDetails: (lead: Lead) => void;
}

export function LeadCard({ lead, onLeadUpdate, onViewDetails }: LeadCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleToggleStatus = async () => {
    setIsUpdating(true);
    try {
      await leadsApi.toggleLeadStatus(lead.id);
      onLeadUpdate({ ...lead, ativo: !lead.ativo });
      toast({
        title: "Status atualizado",
        description: `Lead ${!lead.ativo ? 'ativado' : 'desativado'} com sucesso.`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do lead.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

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

  return (
    <Card className="group relative bg-gradient-card border-border hover:border-primary/20 transition-all duration-300 hover:shadow-card hover:shadow-primary/10 animate-fade-in">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground truncate">{lead.nome}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Mail className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm text-muted-foreground truncate">{lead.email}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={lead.ativo ? 'active' : 'inactive'}
              onClick={handleToggleStatus}
              className={isUpdating ? 'opacity-50' : ''}
            >
              {lead.ativo ? 'Ativo' : 'Inativo'}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover border-border">
                <DropdownMenuItem onClick={() => onViewDetails(lead)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Ver detalhes
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">{formatPhone(lead.telefone)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground truncate">{lead.segmento}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              {formatCurrency(lead.faturamentoAnual)}
            </span>
            <span className="text-xs text-muted-foreground">/ ano</span>
          </div>
          
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">{lead.regimeTributario}</span>
          </div>

          {lead.cnpj && (
            <div className="text-xs text-muted-foreground">
              CNPJ: {lead.cnpj}
            </div>
          )}
        </div>

        {lead.consultorNome && (
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm text-foreground">Consultor: {lead.consultorNome}</span>
          </div>
        )}

        <Button 
          onClick={() => onViewDetails(lead)}
          variant="outline" 
          size="sm" 
          className="w-full mt-4 group-hover:border-primary/50 transition-colors"
        >
          <Eye className="mr-2 h-4 w-4" />
          Ver detalhes
        </Button>
      </CardContent>
    </Card>
  );
}