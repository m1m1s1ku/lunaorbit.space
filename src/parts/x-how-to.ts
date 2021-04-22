import {
  html,
  customElement,
  LitElement,
  internalProperty,
  TemplateResult,
  property,
} from 'lit-element';
import {msg} from '@lit/localize';
import { Localized } from '@lit/localize/localized-element.js';

import '../components/cta-hero';
import { CTA, ctaForPage, loadGlossary, loadSteps, Step, Word } from '../backend';
import { retrieveSupabase } from '../luna-orbit';
import { loader } from './dashboard/home';

/**
 * How to choose a validator component
 */
@customElement('x-how-to')
export class XHowTo extends Localized(LitElement) {
  @internalProperty()
  private step = '0';

  @property({ type: Boolean })
  public loading = false;

  @internalProperty()
  private _cta: CTA | null = null;
  @internalProperty()
  private _steps: Step[] | null = null;
  @internalProperty()
  private _dictionary: Word[] | null = null;

  createRenderRoot(): this {
    return this;
  }

  async firstUpdated(): Promise<void> {
    const db = retrieveSupabase();

    this.loading = true;

    this._steps = await loadSteps(db);
    this._cta = await ctaForPage(db, 'how-to');
    this._dictionary = await loadGlossary(db);

    this.loading = false;
  }

  private _onTabClick(e: Event) {
    const item = e.target as HTMLElement;
    if (item.dataset.img) {
      this.step = item.dataset.img;
    }
  }

  protected _glossaryItem(title: string, text: string): TemplateResult {
    return html`
      <a class="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50">
        <div class="ml-4">
          <p class="text-base font-medium text-gray-900">
            ${title}
          </p>
          <p class="mt-1 text-md text-gray-500">
            ${text}
          </p>
        </div>
      </a>
    `;
  }

  private _tabItem(title: string, img: string, active?: boolean) {
    return html`
      <li class="mr-1">
        <a
          data-img="${img}"
          class="cursor-pointer	bg-white inline-block rounded-t py-2 px-4 ${active ? 'active font-semibold border-l border-t border-r text-blue-800' : ''}"
          >
          ${title}
        </a>
      </li>
    `;
  }

  render(): TemplateResult {
    return html`
      <section
        class="container mx-auto px-2 py-4 text-gray-700 body-font border-t border-gray-200"
      >
        <h1 class="text-xl ml-4 mb-4 pt-6 pb-6">
          ${msg('How to start staking on Terra ?')}
        </h1>

        ${this.loading ? loader() : html`
        <ul
          class="list-reset flex border-b"
          @click=${this._onTabClick}
        >
          ${this._steps && this._steps.map(item => {
            return this._tabItem(item.title, item.img, this.step === item.img);
          })}          
        </ul>
        
        <div class="p-4" id="tabs">
          <img src=${`/assets/${this.step}.png`} alt="download terra station" />
        </div>

        <div
          class="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden"
        >
          <div class="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
            <h2 class="text-md pointer-events-none">${msg('Glossary')}</h2>
            ${this._dictionary && this._dictionary.map(item => {
              return this._glossaryItem(item.title, item.text)
            })}
          </div>
        </div>
        ${this._cta ? html`
        <cta-hero .title=${this._cta.title} href=${this._cta.href} .ctaText=${this._cta['cta-text']}></cta-hero>
        ` : html``}
        `}

      </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'x-how-to': XHowTo;
  }
}
