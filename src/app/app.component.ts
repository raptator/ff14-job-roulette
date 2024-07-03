import { Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public selection: number = 0;

  public ilvl: number[] = [];
  public ilvl_text: string = '';

  public LimitedJob: boolean = false;
  public ilvlRequis: number;
  ivlsRequis: { label: string; valeur: number }[] = [
    { label: 'Expert', valeur: 620 },
    { label: 'Donjons nv 90', valeur: 590 },
    { label: 'Donjons nv 50/60/70/80', valeur: 1 },
    { label: 'Gain de niveaux', valeur: 1 },
    { label: 'Défis', valeur: 1 },
    { label: 'Épopée', valeur: 1 },
    { label: 'Opérations de guilde', valeur: 1 },
    { label: 'Raids en alliance', valeur: 565 },
    { label: 'Raids normaux', valeur: 170 },
    { label: 'Mentor', valeur: 625 },
    { label: 'Front', valeur: 1 },
  ];

  public displayBasic: boolean;

  constructor(private primengConfig: PrimeNGConfig) {}

  ngOnInit() {
    this.primengConfig.ripple = true;

    for (let i = 0; i < 100; i++) {
      this.ilvl.push(0);
    }

    this.ilvl_text = String(this.ilvl);
  }

  public ChargerIlvl() {
    this.ilvl = this.ilvl_text.split(',').map(Number);
  }

  public ChargerIlvlPlus() {
    this.ilvl_text = window.localStorage.getItem('FFXIVMesIlvls');
    this.ilvl = this.ilvl_text.split(',').map(Number);
  }

  public SauverIlvl() {
    this.ilvl_text = String(this.ilvl);
    window.localStorage.setItem('FFXIVMesIlvls', this.ilvl_text);
  }

  CheckRoulette() {
    return (
      this.ilvlRequis && !this.ilvl.some((valeur) => valeur >= this.ilvlRequis)
    );
  }

  public async roulette() {
    //Math.floor(Math.random()*3+1)
    this.showBasicDialog(false);

    (async () => {
      for (let i = 0; i < 50; i++) {
        await new Promise((f) => setTimeout(f, 100)).then(async () => {
          this.selection = this.NumeroValide(this.selection);
        });
      }

      let precedent = this.selection;
      this.selection = 0;
      await new Promise((f) => setTimeout(f, 1000)).then(async () => {
        this.selection = this.NumeroValide(precedent);
        this.showBasicDialog(true);
      });
    })();
  }

  NumeroValide(precedent: number) {
    let selectionTemp: number = 0;
    let selection: number = 0;
    let iterations: number = 0;

    do {
      selectionTemp = Math.floor(Math.random() * 23 + 1);

      if (
        [20, 23].some((exclu) => exclu == selectionTemp) &&
        !this.LimitedJob
      ) {
        //on fais rien
      } else if (this.ilvl[selectionTemp - 1] < this.ilvlRequis) {
        //on fais rien
      } else {
        selection = selectionTemp;
      }
      iterations++;
    } while (selection === 0 && iterations < 100);

    if (selection) {
      return selection;
    } else {
      return precedent;
    }
  }

  showBasicDialog(state: boolean) {
    this.displayBasic = state;
  }

  DiagCssConditionTank() {
    let condition: boolean = this.selection >= 1 && this.selection <= 4;
    return condition;
  }

  DiagCssConditionHeal() {
    let condition: boolean = this.selection >= 5 && this.selection <= 8;
    return condition;
  }

  DiagCssConditionDps() {
    let condition: boolean =
      (this.selection >= 9 && this.selection <= 19) ||
      [21, 22].some((inc) => inc == this.selection);
    return condition;
  }
}
