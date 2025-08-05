import { useState, useEffect, useMemo } from 'react';
import { Lead, LeadsResponse } from '@/types/lead';
import { leadsApi } from '@/services/api';
import { Header } from '@/components/layout/Header';
import { LeadsGrid } from '@/components/leads/LeadsGrid';
import { LeadModal } from '@/components/leads/LeadModal';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Filter, Download } from 'lucide-react';

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalLeads, setTotalLeads] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  // Filtered leads based on search term
  const filteredLeads = useMemo(() => {
    if (!searchTerm) return leads;
    
    const searchLower = searchTerm.toLowerCase();
    return leads.filter(lead => 
      lead.nome.toLowerCase().includes(searchLower) ||
      lead.email.toLowerCase().includes(searchLower) ||
      lead.telefone.includes(searchTerm) ||
      lead.segmento.toLowerCase().includes(searchLower) ||
      lead.regimeTributario.toLowerCase().includes(searchLower) ||
      (lead.cnpj && lead.cnpj.includes(searchTerm))
    );
  }, [leads, searchTerm]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response: LeadsResponse = await leadsApi.getAllLeads();
      setLeads(response.leads);
      setTotalLeads(response.total);
    } catch (error) {
      toast({
        title: "Erro ao carregar leads",
        description: "Não foi possível carregar a lista de leads. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);


  const handleLeadUpdate = (updatedLead: Lead) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === updatedLead.id ? updatedLead : lead
      )
    );
    
    if (selectedLead && selectedLead.id === updatedLead.id) {
      setSelectedLead(updatedLead);
    }
  };

  const handleLeadDelete = (leadId: string) => {
    setLeads(prevLeads => prevLeads.filter(lead => lead.id !== leadId));
    setTotalLeads(prev => prev - 1);
  };

  const handleViewDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
  };

  const handleRefresh = () => {
    fetchLeads();
  };

  const activeLeads = filteredLeads.filter(lead => lead.ativo).length;
  const inactiveLeads = filteredLeads.filter(lead => !lead.ativo).length;

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      
      <main className="container mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-card border border-border rounded-lg p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Leads</p>
                <p className="text-2xl font-bold text-foreground">{searchTerm ? filteredLeads.length : totalLeads}</p>
              </div>
              <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-primary font-semibold">
                  {searchTerm ? filteredLeads.length : totalLeads}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-card border border-border rounded-lg p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Leads Ativos</p>
                <p className="text-2xl font-bold text-success">{activeLeads}</p>
              </div>
              <Badge variant="active" className="text-xs">
                {filteredLeads.length > 0 ? Math.round((activeLeads / filteredLeads.length) * 100) : 0}%
              </Badge>
            </div>
          </div>

          <div className="bg-gradient-card border border-border rounded-lg p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Leads Inativos</p>
                <p className="text-2xl font-bold text-muted-foreground">{inactiveLeads}</p>
              </div>
              <Badge variant="inactive" className="text-xs">
                {filteredLeads.length > 0 ? Math.round((inactiveLeads / filteredLeads.length) * 100) : 0}%
              </Badge>
            </div>
          </div>

        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-foreground">
              {searchTerm ? `Resultados para "${searchTerm}"` : 'Todos os Leads'}
            </h2>
            {searchTerm && (
              <Badge variant="outline" className="text-sm">
                {filteredLeads.length} resultado{filteredLeads.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Leads Grid */}
        <div className="mb-8">
          <LeadsGrid
            leads={searchTerm ? filteredLeads : leads}
            isLoading={loading}
            onLeadUpdate={handleLeadUpdate}
            onViewDetails={handleViewDetails}
            onLeadDelete={handleLeadDelete}
          />
        </div>


        {/* Lead Details Modal */}
        <LeadModal
          lead={selectedLead}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onLeadUpdate={handleLeadUpdate}
        />
      </main>
    </div>
  );
}