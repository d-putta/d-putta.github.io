import { Ambient } from '@/components/Ambient/Ambient';
import { Contact } from '@/components/Contact/Contact';
import { Certifications } from '@/components/Certifications/Certifications';
import { Focus } from '@/components/Focus/Focus';
import { Footer } from '@/components/Footer/Footer';
import { Guide } from '@/components/Guide/Guide';
import { Hero } from '@/components/Hero/Hero';
import { Metrics } from '@/components/Metrics/Metrics';
import { Nav } from '@/components/Nav/Nav';
import { Section } from '@/components/Section/Section';
import { Skills } from '@/components/Skills/Skills';
import { SystemsMap } from '@/components/SystemsMap/SystemsMap';
import { Ticker } from '@/components/Ticker/Ticker';
import { Work } from '@/components/Work/Work';
import { profile } from '@/content/profile';

/** Interface label; page copy comes from `profile`. */
const SKIP_LINK_LABEL = 'Skip to content';

export function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        {SKIP_LINK_LABEL}
      </a>
      <Ambient />
      <Nav />
      <main id="main">
        <Hero />
        <SystemsMap />
        <Ticker />
        <Metrics />
        <Section
          id="focus"
          index={profile.focus.index}
          title={profile.focus.title}
          blurb={profile.focus.blurb}
        >
          <Focus />
        </Section>
        <Section
          id="work"
          index={profile.work.index}
          title={profile.work.title}
          blurb={profile.work.blurb}
        >
          <Work />
        </Section>
        <Section
          id="skills"
          index={profile.skills.index}
          title={profile.skills.title}
          blurb={profile.skills.blurb}
        >
          <Skills />
        </Section>
        <Section
          id="certs"
          index={profile.credentials.index}
          title={profile.credentials.title}
          blurb={profile.credentials.blurb}
        >
          <Certifications />
        </Section>
        <Contact />
      </main>
      <Footer />
      <Guide />
    </>
  );
}
