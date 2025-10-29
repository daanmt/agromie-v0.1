import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useSpeech } from "@/hooks/use-speech";

interface MetricsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: "default" | "success" | "warning" | "accent";
  iconClassName?: string;
  borderClassName?: string;
}

export function MetricsCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  variant = "default",
  iconClassName,
  borderClassName
}: MetricsCardProps) {
  const { speak } = useSpeech();

  const handleMouseEnter = () => {
    const trendText = trend 
      ? `${trend.isPositive ? "aumento" : "diminuição"} de ${trend.value.replace("+", "").replace("-", "")}` 
      : "";
    const subtitleText = subtitle ? `. ${subtitle}` : "";
    speak(`${title}: ${value}${subtitleText}${trendText ? `. ${trendText}` : ""}`);
  };

  const getVariantClasses = () => {
    switch (variant) {
      case "success":
        return "bg-gradient-to-br from-success/10 to-success/5 border-success/20";
      case "warning":
        return "bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20";
      case "accent":
        return "bg-gradient-to-br from-accent/20 to-accent-primary/10 border-accent/30";
      default:
        return "bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20";
    }
  };

  const getIconVariant = () => {
    switch (variant) {
      case "success":
        return "bg-success text-success-foreground";
      case "warning":
        return "bg-warning text-warning-foreground";
      case "accent":
        return "bg-accent-primary text-accent-foreground";
      default:
        return "bg-primary text-primary-foreground";
    }
  };

  return (
    <Card 
      className={cn(
        "border-2 shadow-card hover:shadow-lg transition-all duration-300", 
        borderClassName || getVariantClasses()
      )}
      onMouseEnter={handleMouseEnter}
      role="article"
      aria-label={`${title}: ${value}`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-foreground">{value}</h3>
              {trend && (
                <span className={cn(
                  "text-sm font-medium",
                  trend.isPositive ? "text-success" : "text-destructive"
                )}>
                  {trend.isPositive ? "+" : ""}{trend.value}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg",
            iconClassName || getIconVariant()
          )}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}