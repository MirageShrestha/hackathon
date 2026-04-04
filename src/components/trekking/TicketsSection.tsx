import { motion } from "framer-motion";
import { Ticket, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "./SectionHeader";
import { tickets, nearbyAttractions } from "./data";

interface Props {
  bookedTickets: string[];
  toggleTicket: (id: string) => void;
  pageVariants: any;
}

export const TicketsSection = ({ bookedTickets, toggleTicket, pageVariants }: Props) => (
  <motion.div key="tickets" {...pageVariants} className="space-y-8">
    <div>
      <SectionHeader icon={Ticket} title="Permits & Entry Tickets" subtitle="Book required permits for your trek" />
      <div className="grid gap-3 sm:grid-cols-2">
        {tickets.map((ticket) => {
          const booked = bookedTickets.includes(ticket.id);
          return (
            <div key={ticket.id} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${booked ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card hover:shadow-sm"}`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${booked ? "bg-primary/10" : "bg-secondary"}`}>
                <Ticket className={`w-5 h-5 ${booked ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{ticket.name}</p>
                  {ticket.required && <Badge variant="destructive" className="text-[8px] px-1.5 py-0">Required</Badge>}
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">{ticket.desc}</p>
                <p className="text-sm font-bold text-foreground mt-1">{ticket.price}</p>
              </div>
              <Button size="sm" variant={booked ? "outline" : "default"} className="rounded-xl text-xs flex-shrink-0 h-9" onClick={() => toggleTicket(ticket.id)}>
                {booked ? "Booked ✓" : "Book"}
              </Button>
            </div>
          );
        })}
      </div>
    </div>

    <div>
      <SectionHeader title="Nearby Attractions" subtitle="Points of interest near trekking routes" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {nearbyAttractions.map((attr) => (
          <div key={attr.id} className="p-4 rounded-2xl bg-card border border-border hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-foreground">{attr.name}</h3>
              <Badge variant="secondary" className="text-[10px] rounded-full">{attr.type}</Badge>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{attr.area}</p>
            <p className="text-xs font-medium text-foreground mt-1">{attr.price}</p>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);
