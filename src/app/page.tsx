import { Navigation } from '@/app/components/Navigation';
import { NewsletterForm } from '@/app/components/NewsletterForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-6xl mx-auto p-4 md:p-6 space-y-8 md:space-y-12">
        <section id="sobre" className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-800 dark:text-primary-400">
            Newsletter para Consumo Consciente e Ação Climática
          </h2>
          <p className="text-foreground/80 max-w-2xl mx-auto text-sm md:text-base">
            Junte-se a nossa comunidade para receber conteúdos educativos e práticos sobre sustentabilidade, ação
            climática e consumo consciente.
          </p>
        </section>

        <section id="newsletter" className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6 text-primary-800 dark:text-primary-400">
            Inscreva-se na Newsletter
          </h2>
          <NewsletterForm />
        </section>

        <section id="ods" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold text-primary-800 dark:text-primary-400 mb-2">
              ODS 4: Educação de Qualidade
            </h3>
            <p className="text-foreground/80">
              Promovendo educação ambiental e conscientização sobre sustentabilidade.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold text-primary-800 dark:text-primary-400 mb-2">
              ODS 12: Consumo Responsável
            </h3>
            <p className="text-foreground/80">Incentivando práticas de consumo consciente e sustentável.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold text-primary-800 dark:text-primary-400 mb-2">ODS 13: Ação Climática</h3>
            <p className="text-foreground/80">Mobilizando a comunidade para combater as mudanças climáticas.</p>
          </div>
        </section>
      </main>

      <footer className="bg-primary-800 text-white mt-12 py-6">
        <div className="max-w-6xl mx-auto text-center px-4">
          <p className="text-sm md:text-base">
            © 2024 Conectando Sustentabilidade. Desenvolvido por Lucas Silveira da Rosa
          </p>
        </div>
      </footer>
    </div>
  );
}
