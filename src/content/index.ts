interface Position {
  x: number;
  y: number;
}

class QuoteSelector {
  private floatingButton: HTMLDivElement | null = null;
  private currentSelection: string = '';

  constructor() {
    this.initializeFloatingButton();
    this.attachEventListeners();
  }

  private initializeFloatingButton(): void {
    this.floatingButton = document.createElement('div');
    this.floatingButton.className = 'quote-generator-button';
    this.floatingButton.innerHTML = '📷';
    this.floatingButton.style.cssText = `
      position: fixed;
      display: none;
      padding: 8px;
      background: #ffffff;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      z-index: 2147483647;
    `;
    
    this.floatingButton.addEventListener('click', this.handleButtonClick.bind(this));
    document.body.appendChild(this.floatingButton);
  }

  private attachEventListeners(): void {
    document.addEventListener('mouseup', this.handleSelection.bind(this));
    document.addEventListener('keyup', this.handleSelection.bind(this));
  }

  private handleSelection(): void {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      this.hideFloatingButton();
      return;
    }

    const text = selection.toString().trim();
    if (text.length === 0) {
      this.hideFloatingButton();
      return;
    }

    this.currentSelection = text;
    const position = this.calculateButtonPosition(selection);
    this.showFloatingButton(position);
  }

  private calculateButtonPosition(selection: Selection): Position {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    return {
      x: rect.left + window.scrollX + (rect.width / 2),
      y: rect.top + window.scrollY - 30
    };
  }

  private showFloatingButton(position: Position): void {
    if (!this.floatingButton) return;
    
    this.floatingButton.style.display = 'block';
    this.floatingButton.style.left = `${position.x}px`;
    this.floatingButton.style.top = `${position.y}px`;
  }

  private hideFloatingButton(): void {
    if (!this.floatingButton) return;
    this.floatingButton.style.display = 'none';
  }

  private handleButtonClick(): void {
    chrome.runtime.sendMessage({
      type: 'OPEN_EDITOR',
      payload: {
        text: this.currentSelection
      }
    });
  }
}

// Initialize the selector
new QuoteSelector(); 