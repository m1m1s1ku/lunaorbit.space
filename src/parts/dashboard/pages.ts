import {
  html,
  customElement,
  LitElement,
  TemplateResult,
  property,
} from 'lit-element';

import {msg} from '@lit/localize';
import {Localized} from '@lit/localize/localized-element.js';
import { putFile } from '../../storage';

import EditorJS from '@editorjs/editorjs';

@customElement('website-pages')
export class WebsitePages extends Localized(LitElement) {

  @property({ type: Object })
  public editor: EditorJS | null = null;

  createRenderRoot(): this {
    return this;
  }

  render(): TemplateResult {
    return html`
        <div class="flex justify-between ml-4 mb-4 pb-6">
          <h1 class="text-xl">
            ${msg('Pages')}
          </h1>
          <div class="flex justify-between gap-2">
            <div class="relative">
              <select
                  class="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base pl-3 pr-7"
                >
                  <option>EN</option>
                  <option>FR</option>
              </select>
              <select
                class="rounded border appearance-none border-gray-300 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 text-base pl-3 pr-7"
              >
                <option value="home">Staking</option>
                <option value="how-to">How to</option>
                <option value="tools">Tools</option>
                <option value="contact">Contact</option>
              </select>
              <span
                class="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center"
              >
                <svg
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  class="w-4 h-4"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 9l6 6 6-6"></path>
                </svg>
              </span>
            </div>
            <button @click=${async () => {
              const outputData = await this.editor?.save();
              const savedTest = await putFile('test.json', JSON.stringify(outputData), {
                contentType: 'text/html',
                encrypt: false,
                dangerouslyIgnoreEtag: false
              });
          
              console.warn(savedTest);
            }} class="bg-blue-500 hover:terra-bg text-white py-2 px-4 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            </button>
            <button class="bg-blue-500 hover:terra-bg text-white py-2 px-4 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
            <button class="bg-blue-500 hover:terra-bg text-white py-2 px-4 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
          </div>
        </div>

        <div id="holder" class="w-full p-4 border-4 rounded-sm"></div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'website-pages': WebsitePages;
  }
}
