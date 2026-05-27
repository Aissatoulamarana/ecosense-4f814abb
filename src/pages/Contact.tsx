import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Layout } from "@/components/layout/Layout";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Magnetic } from "@/components/ui/magnetic-button";
import { ParallaxImage } from "@/components/ui/parallax-image";
import contactOffice from "@/assets/2026-contact-office.jpg";
import { toast } from "sonner";
import { useSiteSettings } from "@/hooks/useSiteSettings";


const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100),
  email: z.string().email("Veuillez entrer une adresse email valide").max(255),
  phone: z.string().optional(),
  inquiryType: z.string().min(1, "Veuillez sélectionner un type de demande"),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères").max(1000),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const { settings } = useSiteSettings();
  const b = settings.brand;
  const contactInfo = [
    { icon: Phone, title: "WhatsApp", value: b.phone, href: b.whatsapp || `tel:${b.phone}`, action: "Discuter avec nous" },
    { icon: MapPin, title: "Adresse", value: b.address, href: "#map", action: "Voir sur la carte" },
    { icon: Clock, title: "Heures d'Ouverture", value: b.hours, href: null as string | null, action: null as string | null },
  ];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("contact_messages").insert({
        name: data.name,
        email: data.email,
        subject: data.inquiryType,
        message: data.message,
      });
      if (error) throw error;
      setIsSubmitted(true);
      reset();
      toast.success("Message envoyé avec succès ! Nous vous répondrons bientôt.");
    } catch (error) {
      toast.error("Échec de l'envoi du message. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-20 hero-gradient">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-2 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
              Contact
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6">
              Restons en <span className="gradient-text">Contact</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Vous avez une question ou souhaitez discuter d'un projet ? Nous
              serions ravis de vous entendre. Contactez-nous et démarrons une
              conversation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16">
        <div className="section-container">
          <div className="grid md:grid-cols-3 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                  <info.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {info.title}
                </h3>
                <p className="text-muted-foreground mb-3">{info.value}</p>
                {info.href && (
                  <a
                    href={info.href}
                    target={info.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      info.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="text-sm text-primary font-medium hover:underline"
                  >
                    {info.action}
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Envoyez-nous un Message
              </h2>

              {isSubmitted ? (
                <div className="glass-card p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <CheckCircle className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Message Envoyé !
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Merci de nous avoir contactés. Nous vous répondrons dans les
                    24 heures.
                  </p>
                  <Button onClick={() => setIsSubmitted(false)}>
                    Envoyer un Autre Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Nom *
                      </label>
                      <Input
                        {...register("name")}
                        placeholder="Votre nom"
                        className={errors.name ? "border-destructive" : ""}
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email *
                      </label>
                      <Input
                        {...register("email")}
                        type="email"
                        placeholder="votre@email.com"
                        className={errors.email ? "border-destructive" : ""}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Téléphone
                      </label>
                      <Input
                        {...register("phone")}
                        placeholder="+224 XXX XXX XXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Je souhaite... *
                      </label>
                      <Select
                        onValueChange={(value) => setValue("inquiryType", value)}
                      >
                        <SelectTrigger
                          className={
                            errors.inquiryType ? "border-destructive" : ""
                          }
                        >
                          <SelectValue placeholder="Sélectionner une option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="quote">Demander un devis</SelectItem>
                          <SelectItem value="inquiry">
                            Renseignement général
                          </SelectItem>
                          <SelectItem value="partnership">
                            Discuter d'un partenariat
                          </SelectItem>
                          <SelectItem value="support">Obtenir de l'aide</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.inquiryType && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.inquiryType.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Message *
                    </label>
                    <Textarea
                      {...register("message")}
                      placeholder="Parlez-nous de votre projet ou question..."
                      rows={5}
                      className={errors.message ? "border-destructive" : ""}
                    />
                    {errors.message && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto shadow-glow"
                  >
                    {isSubmitting ? (
                      "Envoi en cours..."
                    ) : (
                      <>
                        Envoyer le Message
                        <Send className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </motion.div>

            {/* Map */}
            <motion.div
              id="map"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Nous Trouver
              </h2>
              <div className="glass-card overflow-hidden rounded-2xl h-[400px] lg:h-full min-h-[400px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31525.574539582513!2d-13.6641!3d9.6412!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xf1cd7c9b7e33d0d%3A0x5ef65d0a8b4f9e7a!2sLambanyi%2C%20Conakry%2C%20Guinea!5e0!3m2!1sen!2s!4v1637000000000!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Emplacement Ecosense Solutions"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="py-16 bg-muted/30">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <MessageCircle className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Préférez-vous Discuter ?
            </h2>
            <p className="text-muted-foreground mb-6">
              Connectez-vous avec nous instantanément sur WhatsApp pour des
              réponses rapides et une assistance en temps réel.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-[#25D366] hover:bg-[#128C7E] shadow-lg"
            >
              <a
                href="https://wa.me/224625718467"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Discuter sur WhatsApp
              </a>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
