import { motion } from "framer-motion";
import { Phone, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "./SectionHeader";
import { emergencyContacts, emergencyGuides } from "./data";

interface Props { pageVariants: any }

export const SafetySection = ({ pageVariants }: Props) => (
  <motion.div key="safety" {...pageVariants} className="space-y-8">
    <div>
      <SectionHeader icon={Shield} title="Emergency Contacts" subtitle="Save these numbers before your trek" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {emergencyContacts.map((contact, i) => (
          <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border hover:shadow-sm transition-shadow">
            <div className="w-11 h-11 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0">
              <contact.icon className="w-5 h-5 text-destructive" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{contact.name}</p>
              <p className="text-xs text-muted-foreground">{contact.desc}</p>
              <p className="text-sm font-bold text-foreground mt-1 font-mono">{contact.number}</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl h-9 w-9 p-0 flex-shrink-0">
              <Phone className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>

    <div>
      <SectionHeader title="What To Do If…" subtitle="Quick survival guides for common emergencies" />
      <div className="grid gap-4 sm:grid-cols-2">
        {emergencyGuides.map((guide, i) => (
          <Card key={i} className="border-border shadow-none hover:shadow-sm transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${guide.color}`}>
                  <guide.icon className="w-5 h-5" />
                </div>
                <CardTitle className="text-sm">{guide.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2.5">
                {guide.steps.map((step, j) => (
                  <li key={j} className="flex gap-2.5 text-xs text-muted-foreground">
                    <span className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-foreground flex-shrink-0 mt-0.5">{j + 1}</span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </motion.div>
);
