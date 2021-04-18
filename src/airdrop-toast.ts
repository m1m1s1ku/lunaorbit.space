import {LitElement, html, TemplateResult, customElement, query, CSSResult, css} from 'lit-element';
import {Localized} from '@lit/localize/localized-element';
import {msg} from '@lit/localize';

/**
 * Banner message component
 */
@customElement('airdrop-toast')
export class AirdropToast extends Localized(LitElement) {
  @query('.toast')
  public toast!: HTMLDivElement;

  public close(): void {
    this.style.display = 'none';
  }

  public static get styles(): CSSResult {
    return css`
    .toast {
      position: fixed;
      flex-direction: column;
      display: grid;
      grid-template-rows: repeat(2, 80px);
      align-items: center;
      top: 150px;
      right: 20px;
      z-index: 9999;
      background: rgb(13 54 147);
      border: 1px solid fade-out(var(--mirror-color), 0.5);
      border-radius: 10px;
      padding: 30px;
      text-align: center;
    }

    .toast .close {
      position: absolute;
      cursor: pointer;
      color: white;
      font-size: 15px;
      top: 20px;
      right: 20px;
    }

    .toast .image {
      margin: 10px;
      animation: rotate 2s infinite;
      animation-timing-function: linear;
      transform-origin: bottom;
    }

    .toast .image svg {
      height: 90px;
      fill: #fff;
    }

    @keyframes rotate {
      25% {
        transform: rotate(-10deg);
      }

      50% {
        transform: rotate(0);
      }

      75% {
        transform: rotate(10deg);
      }

      100% {
        transform: rotate(0);
      }
    }

    .toast .content {
      color: grey;
      font-size: 12px;
      margin-bottom: 20px;
    }

    .toast .content button {
      position: relative;
      outline: none;
      border: none;
      border-radius: 99px;
      padding: 1rem 2rem;
      background-color: transparent;
      overflow: visible;
      color: black;
      cursor: pointer;
      background-color: #fff;
      margin-top: 3em;
    }

    .toast .content button .text {
      position: relative;
      z-index: 2;
    }
    `;
  }

  render(): TemplateResult {
    return html`
      <div class="toast">
        <div class="close" @click=${() => {
          sessionStorage.setItem('lunaorbit-airdrops-hide', 'true');
          this.close();
        }}>
          X
        </div>
        <div class="image">
          <svg viewBox="0 0 63 80">
            <path d="M31.5 0A31.64 31.64 0 0163 28.7c-6.46 10.76-12.81 22.06-19.16 33.04a13.3 13.3 0 11-24.69 0C12.82 50.77 6.38 39.5 0 28.7A31.64 31.64 0 0131.5 0zm-1.07 56.53v3.26l-2.93-.68v3.26l-2.94-.68v10.5l2.94.68v3.25l2.93.68v-3.25l2.94.67v-3.25l2.94.67v-10.5l-2.94-.68v-3.25l-2.94-.68zm-3.52 7.87l4.1.94v6.17l-4.1-.95V64.4zM7.66 25a8.29 8.29 0 00-6.55 3.2l18.63 32.28a13.36 13.36 0 014.05-4.61L13.39 27.3A8.27 8.27 0 007.66 25zm47.68 0c-2.22 0-4.24.88-5.73 2.3l-10.4 28.57a13.37 13.37 0 014.05 4.61l18.63-32.27a8.29 8.29 0 00-6.55-3.2zM19.7 25c-1.99 0-3.81.7-5.24 1.88l10.32 28.35c1.41-.83 3-1.4 4.69-1.67L24.72 26.7A8.26 8.26 0 0019.7 25zm23.62 0c-1.9 0-3.64.64-5.03 1.7l-4.74 26.86c1.7.26 3.28.84 4.7 1.67l10.31-28.35A8.27 8.27 0 0043.31 25zm-11.66 0c-2.2 0-4.19.86-5.67 2.25l4.61 26.19a13.62 13.62 0 011.82 0l4.66-26.42A8.28 8.28 0 0031.65 25z"/>
          </svg>
        </div>
        <div class="content">
          <button @click=${() => {
            const orbit = document.querySelector('luna-orbit');
            orbit?.showAirdropDialog();
            this.close();
          }}>
      	<span class="text">${msg('Check airdrops !')}</span>
        </button>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'airdrop-toast': AirdropToast;
  }
}
