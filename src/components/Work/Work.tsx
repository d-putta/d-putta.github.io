import { Card } from '@/components/Card/Card';
import { Reveal } from '@/components/Reveal/Reveal';
import { profile } from '@/content/profile';
import type { Project, ProjectVisual } from '@/content/types';
import { cx } from '@/lib/cx';
import { A11yVisual } from './A11yVisual';
import { ArchVisual } from './ArchVisual';
import { ConsoleVisual } from './ConsoleVisual';
import { PipelineVisual } from './PipelineVisual';
import styles from './Work.module.css';

/** Global pill modifier class for a kicker pill's tone. */
function toneClass(tone: Project['pills'][number]['tone']): string | undefined {
  switch (tone) {
    case 'live':
      return 'pill-live';
    case 'accent':
      return 'pill-accent';
    default:
      return undefined;
  }
}

/** Picks the illustration for a project's `visual.kind`. */
function Visual({ visual }: { visual: ProjectVisual }) {
  switch (visual.kind) {
    case 'pipeline':
      return <PipelineVisual visual={visual} />;
    case 'a11y':
      return <A11yVisual visual={visual} />;
    case 'arch':
      return <ArchVisual visual={visual} />;
    case 'console':
      return <ConsoleVisual visual={visual} />;
  }
}

/**
 * Inner content of the Selected Work section: a vertical list of tilting glass
 * project cards, each with its copy on the left and a kind-specific visual on
 * the right, revealed on scroll with a 90ms stagger per card.
 */
export function Work() {
  return (
    <div className={styles.work}>
      {profile.work.projects.map((project, i) => {
        const titleId = `${project.id}-title`;
        return (
          <Reveal key={project.id} className={cx(styles.item)} delay={i * 90}>
            <Card
              as="article"
              tilt
              className={cx(styles.project, project.featured && styles.featured)}
              aria-labelledby={titleId}
            >
              <div className={styles.copy}>
                <div className={styles.kicker}>
                  {project.pills.map((pill) => (
                    <span key={pill.label} className={cx('pill', toneClass(pill.tone))}>
                      {pill.label}
                    </span>
                  ))}
                </div>
                <h3 className={styles.title} id={titleId}>
                  {project.title}
                </h3>
                <p className={styles.description}>{project.description}</p>
                {project.outcomes.length > 0 ? (
                  <div className={styles.outcome}>
                    {project.outcomes.map((outcome) => (
                      <div key={outcome.label} className={styles.outcomeItem}>
                        <b className={cx(styles.outcomeValue, 'num')}>{outcome.value}</b>
                        <span className={styles.outcomeLabel}>{outcome.label}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
                <div className={styles.stack}>
                  {project.stack.map((item) => (
                    <span key={item} className="tag">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <Visual visual={project.visual} />
            </Card>
          </Reveal>
        );
      })}
    </div>
  );
}
