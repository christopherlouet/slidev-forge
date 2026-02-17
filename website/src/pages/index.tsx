import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

type FeatureItem = {
  title: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'YAML-Driven',
    description: (
      <>
        Define your entire presentation in a simple YAML file. Two lines is all
        you need to get started &mdash; title and author.
      </>
    ),
  },
  {
    title: '10 Visual Themes',
    description: (
      <>
        Choose from 10 built-in color themes like Cyberpunk, Dracula, Nord, and
        Tokyo Night, or define your own custom colors.
      </>
    ),
  },
  {
    title: '13 Section Types',
    description: (
      <>
        From code blocks and diagrams to two-column layouts and animated steps,
        each section type generates ready-to-use Slidev content.
      </>
    ),
  },
  {
    title: 'CLI Toolbox',
    description: (
      <>
        Validate configs, add sections, switch themes, and regenerate slides
        &mdash; all from the command line.
      </>
    ),
  },
];

function Feature({title, description}: FeatureItem) {
  return (
    <div className={clsx('col col--3')}>
      <div className="text--center padding-horiz--md padding-vert--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/getting-started/installation">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      description="Scaffold complete Slidev presentation projects from a YAML config file or interactive prompts.">
      <HomepageHeader />
      <main>
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              {FeatureList.map((props, idx) => (
                <Feature key={idx} {...props} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
