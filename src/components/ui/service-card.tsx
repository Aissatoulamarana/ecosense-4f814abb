import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  index?: number;
}

export function ServiceCard({
  title,
  description,
  icon: Icon,
  href,
  index = 0,
}: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        to={href}
        className={cn(
          "group block p-6 lg:p-8 rounded-2xl transition-all duration-300",
          "bg-card border border-border/50",
          "hover:shadow-xl hover:-translate-y-1 hover:border-primary/20"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="mb-5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20 transition-colors">
              <Icon className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm flex-1 mb-4">
            {description}
          </p>
          <div className="flex items-center text-primary font-medium text-sm">
            <span>Learn more</span>
            <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
