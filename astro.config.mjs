// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import cloudflare from '@astrojs/cloudflare';
import partytown from '@astrojs/partytown';
import sitemap from '@astrojs/sitemap';
import remarkGfm from 'remark-gfm';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: 'https://buffbook.chitilivorno.workers.dev',
  output: 'server',

  markdown: {
    remarkPlugins: [remarkGfm],
  },

  integrations: [
    starlight({
      title: 'BuffBook',
      description: 'A comprehensive, science-based guide to muscle hypertrophy and resistance training.',
      logo: {
        light: './src/assets/logo.svg',
        dark: './src/assets/logo.svg',
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/classy-giraffe/BuffBook' },
      ],
      customCss: ['./src/styles/custom.css'],
      // Disable table of contents (right sidebar)
      tableOfContents: false,
      components: {
        Footer: './src/components/overrides/Footer.astro',
        Head: './src/components/overrides/Head.astro',
      },
      sidebar: [
        // ── Introduction ──────────────────────────────────────────────────────
        {
          label: 'Introduction',
          items: [
            { label: 'State of the Industry', slug: 'introduction/state-of-industry' },
            { label: 'What is Hypertrophy?', slug: 'introduction/what-is-hypertrophy' },
            { label: 'Hierarchy of Evidence', slug: 'introduction/hierarchy-of-evidence' },
          ],
        },

        // ── Chapter 1: The Science of Size ───────────────────────────────────
        {
          label: 'Chapter 1: The Science of Size',
          items: [
            { label: 'Overview', slug: 'chapter1/overview' },
            { label: 'Mechanotransduction', slug: 'chapter1/mechanotransduction' },
            { label: 'mTORC1', slug: 'chapter1/mtorc1' },
            { label: 'Ribosomes & Satellite Cells', slug: 'chapter1/ribosomes-satellite-cells' },
            { label: 'Summary & References', slug: 'chapter1/summary-references' },
          ],
        },

        // ── Chapter 2: The True Drivers vs. The Myths ────────────────────────
        {
          label: 'Chapter 2: True Drivers vs. Myths',
          items: [
            { label: 'Overview', slug: 'chapter2/overview' },
            {
              label: 'Mechanical Tension',
              items: [
                { label: 'Overview', slug: 'chapter2/mechanical-tension' },
                { label: 'Motor Units', slug: 'chapter2/motor-units' },
                { label: 'Defining Tension', slug: 'chapter2/defining-tension' },
                { label: 'Size Principle', slug: 'chapter2/size-principle' },
                { label: 'Force-Velocity Curve', slug: 'chapter2/force-velocity' },
                { label: 'Recruitment & Effort', slug: 'chapter2/recruitment-effort' },
                { label: 'Synergy', slug: 'chapter2/synergy' },
              ],
            },
            {
              label: 'The Myths',
              items: [
                { label: 'Overview', slug: 'chapter2/myths' },
                { label: 'Metabolic Stress', slug: 'chapter2/metabolic-stress' },
                { label: 'The Pump', slug: 'chapter2/the-pump' },
                { label: 'Muscle Damage', slug: 'chapter2/muscle-damage' },
              ],
            },
            { label: 'Summary & References', slug: 'chapter2/summary-references' },
          ],
        },

        // ── Chapter 3: The Specificity of Hypertrophy ────────────────────────
        {
          label: 'Chapter 3: Specificity of Hypertrophy',
          items: [
            { label: 'Overview', slug: 'chapter3/overview' },
            {
              label: 'Regional Hypertrophy',
              items: [
                { label: 'Overview', slug: 'chapter3/regional-hypertrophy' },
                { label: 'SMH vs NMM', slug: 'chapter3/smh-vs-nmm' },
                { label: 'Scientific Status', slug: 'chapter3/scientific-status' },
              ],
            },
            { label: 'Contraction Type', slug: 'chapter3/contraction-type' },
            { label: 'Fiber Types', slug: 'chapter3/fiber-types' },
            { label: 'Summary & References', slug: 'chapter3/summary-references' },
          ],
        },

        // ── Chapter 4: Exercise Selection & Equipment ─────────────────────────
        {
          label: 'Chapter 4: Exercise Selection',
          items: [
            { label: 'Overview', slug: 'chapter4/overview' },
            { label: 'Joint Actions', slug: 'chapter4/joint-actions' },
            {
              label: 'Selection Principles',
              items: [
                { label: 'Overview', slug: 'chapter4/principles' },
                { label: 'Stability', slug: 'chapter4/stability' },
                { label: 'Loadability', slug: 'chapter4/loadability' },
                { label: 'Enjoyment', slug: 'chapter4/enjoyment' },
                { label: 'Joint Actions & Insufficiency', slug: 'chapter4/joint-actions-insufficiency' },
              ],
            },
            {
              label: 'Exercise Menu',
              items: [
                { label: 'Overview', slug: 'chapter4/exercise-menu' },
                { label: 'One Exercise Rule', slug: 'chapter4/one-exercise-rule' },
                { label: 'Two Exercise Rule', slug: 'chapter4/two-exercise-rule' },
              ],
            },
            {
              label: 'Evaluating Equipment',
              items: [
                { label: 'Overview', slug: 'chapter4/evaluating-equipment' },
                { label: 'Free Weights', slug: 'chapter4/free-weights' },
                { label: 'Machines & Cables', slug: 'chapter4/machines-cables' },
                { label: 'Execution Determines Outcome', slug: 'chapter4/execution-determines-outcome' },
              ],
            },
            { label: 'Summary & References', slug: 'chapter4/summary-references' },
          ],
        },

        // ── Chapter 5: Programming the Variables ─────────────────────────────
        {
          label: 'Chapter 5: Programming Variables',
          items: [
            { label: 'Overview', slug: 'chapter5/overview' },
            {
              label: 'Intensity',
              items: [
                { label: 'Overview', slug: 'chapter5/intensity' },
                { label: 'RIR', slug: 'chapter5/rir' },
                { label: 'RPE', slug: 'chapter5/rpe' },
              ],
            },
            {
              label: 'Volume',
              items: [
                { label: 'Overview', slug: 'chapter5/volume' },
                { label: 'Volume Landmarks', slug: 'chapter5/volume-landmarks' },
                { label: 'Fractional Sets', slug: 'chapter5/fractional-sets' },
                { label: 'Hard vs Soft Sets', slug: 'chapter5/hard-vs-soft' },
              ],
            },
            {
              label: 'Rep Ranges',
              items: [
                { label: 'Overview', slug: 'chapter5/rep-ranges' },
                { label: 'Theoretical vs Practical', slug: 'chapter5/theoretical-vs-practical' },
                { label: 'Rep Range Selection', slug: 'chapter5/rep-range-selection' },
                { label: 'Tempo & TUT', slug: 'chapter5/tempo-tut' },
              ],
            },
            { label: 'Range of Motion', slug: 'chapter5/rom' },
            {
              label: 'Frequency',
              items: [
                { label: 'Overview', slug: 'chapter5/frequency' },
                { label: 'Frequency Evidence', slug: 'chapter5/frequency-evidence' },
                { label: 'Set Distribution', slug: 'chapter5/set-distribution' },
                { label: 'Matching Volume & Split', slug: 'chapter5/matching-volume-split' },
              ],
            },
            { label: 'Sequencing', slug: 'chapter5/sequencing' },
            {
              label: 'Progressive Overload',
              items: [
                { label: 'Overview', slug: 'chapter5/progressive-overload' },
                { label: 'Strength Indicator', slug: 'chapter5/strength-indicator' },
                { label: 'Double Progression', slug: 'chapter5/double-progression' },
              ],
            },
            { label: 'Summary & References', slug: 'chapter5/summary-references' },
          ],
        },

        // ── Chapter 6: From Plan to Practice ─────────────────────────────────
        {
          label: 'Chapter 6: Plan to Practice',
          items: [
            { label: 'Overview', slug: 'chapter6/overview' },
            {
              label: 'Training Hierarchy',
              items: [
                { label: 'Overview', slug: 'chapter6/hierarchy' },
                { label: 'Macrocycle', slug: 'chapter6/macrocycle' },
                { label: 'Mesocycle', slug: 'chapter6/mesocycle' },
                { label: 'Microcycle', slug: 'chapter6/microcycle' },
                { label: 'Session', slug: 'chapter6/session' },
              ],
            },
            { label: 'The Six Levers', slug: 'chapter6/six-levers' },
            { label: 'Repeated Workouts', slug: 'chapter6/repeated-workouts' },
            {
              label: 'Program Examples',
              items: [
                { label: 'Overview', slug: 'chapter6/program-example' },
                { label: 'Full Body', slug: 'chapter6/full-body' },
                { label: 'Upper/Lower', slug: 'chapter6/upper-lower' },
                { label: 'Torso/Limbs', slug: 'chapter6/torso-limbs' },
                { label: 'Anterior/Posterior', slug: 'chapter6/anterior-posterior' },
                { label: 'PPL/UL', slug: 'chapter6/pplul' },
                { label: 'PPL/PPL', slug: 'chapter6/ppl-ppl' },
              ],
            },
            { label: 'Auto-Regulation', slug: 'chapter6/auto-regulation' },
            { label: 'Deloads', slug: 'chapter6/deloads' },
            { label: 'When Progress Stalls', slug: 'chapter6/when-progress-stalls' },
            { label: 'Stringing Blocks', slug: 'chapter6/stringing-blocks' },
            { label: 'FAQs', slug: 'chapter6/faqs' },
            { label: 'Summary & References', slug: 'chapter6/summary-references' },
          ],
        },

        // ── Chapter 7: Nutrition ──────────────────────────────────────────────
        {
          label: 'Chapter 7: Nutrition',
          items: [
            { label: 'Overview', slug: 'chapter7/overview' },
            { label: 'What Are Calories', slug: 'chapter7/calories' },
            { label: 'Energy Expenditure', slug: 'chapter7/energy-expenditure' },
            { label: 'Calories In vs Out', slug: 'chapter7/cico' },
            {
              label: 'Macronutrients',
              items: [
                { label: 'Overview', slug: 'chapter7/macronutrients' },
                { label: 'Protein', slug: 'chapter7/protein' },
                { label: 'Carbohydrates', slug: 'chapter7/carbohydrates' },
                { label: 'Fats', slug: 'chapter7/fats' },
                { label: 'Fiber', slug: 'chapter7/fiber' },
                { label: 'Alcohol', slug: 'chapter7/alcohol' },
              ],
            },
            { label: 'Micronutrients', slug: 'chapter7/micronutrients' },
            { label: 'Food Quality vs Quantity', slug: 'chapter7/food-quality' },
            { label: 'Body Composition Phases', slug: 'chapter7/body-composition' },
            { label: 'Weight Loss Myths', slug: 'chapter7/weight-loss-myths' },
            { label: 'Meal Timing & Frequency', slug: 'chapter7/meal-timing' },
            { label: 'Supplements', slug: 'chapter7/supplements' },
            { label: 'Summary & References', slug: 'chapter7/summary-references' },
          ],
        },

        // ── Glossary ──────────────────────────────────────────────────────────
        { label: 'Glossary', slug: 'glossary' },
      ],
    }),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
    sitemap(),
  ],

  adapter: cloudflare({}),

  vite: {
    optimizeDeps: {
      exclude: ['better-auth', '@better-auth/kysely-adapter'],
    },
    resolve: {
      alias: {
        '@components': resolve(__dirname, './src/components'),
      },
    },
  },
});