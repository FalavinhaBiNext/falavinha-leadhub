import { useState } from 'react';
import { Lead } from '@/types/lead';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Mail, Phone, Building2, TrendingUp, FileText, Users, Eye, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { leadsApi } from '@/services/api';

interface LeadCardProps {
  lead: Lead;
  onLeadUpdate: (updatedLead: Lead) => void;
  onViewDetails: (lead: Lead) => void;
  onLeadDelete: (leadId: string) => void;
}

export function LeadCard({ lead, onLeadUpdate, onViewDetails, onLeadDelete }: LeadCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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

  const handleDeleteLead = async () => {
    setIsDeleting(true);
    try {
      await leadsApi.deleteLead(lead.id);
      onLeadDelete(lead.id);
      toast({
        title: "Lead excluído",
        description: "Lead foi excluído com sucesso.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o lead.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
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
          <Badge
            variant={lead.ativo ? 'active' : 'inactive'}
            onClick={handleToggleStatus}
            className={isUpdating ? 'opacity-50' : ''}
          >
            {lead.ativo ? 'Ativo' : 'Inativo'}
          </Badge>
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

        <div className="flex gap-2 mt-4">
          <Button 
            onClick={() => onViewDetails(lead)}
            variant="outline" 
            size="sm" 
            className="flex-1 group-hover:border-primary/50 transition-colors"
          >
            <Eye className="mr-2 h-4 w-4" />
            Ver detalhes
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                size="sm"
                className="px-3"
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-card border-border">
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground">
                  Tem certeza que deseja excluir o lead <strong>{lead.nome}</strong>? 
                  Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteLead}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Excluindo...' : 'Excluir'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}