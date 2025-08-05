import { Lead } from '@/types/lead';
import { LeadCard } from './LeadCard';
import { Skeleton } from '@/components/ui/skeleton';

interface LeadsGridProps {
  leads: Lead[];
  isLoading: boolean;
  onLeadUpdate: (updatedLead: Lead) => void;
  onViewDetails: (lead: Lead) => void;
}

export function LeadsGrid({ leads, isLoading, onLeadUpdate, onViewDetails }: LeadsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="space-y-4 p-6 border border-border rounded-lg bg-card">
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-9 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-muted rounded-full p-6 mb-4">
          <Users className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          Nenhum lead encontrado
        </h3>
        <p className="text-muted-foreground max-w-md">
          Não há leads cadastrados no sistema ou todos estão filtrados.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {leads.map((lead) => (
        <LeadCard
          key={lead.id}
          lead={lead}
          onLeadUpdate={onLeadUpdate}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}

// Import necessário para o ícone
import { Users } from 'lucide-react';