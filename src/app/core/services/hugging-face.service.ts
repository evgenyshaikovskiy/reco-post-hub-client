import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HfInference } from '@huggingface/inference';
import { catchError, from, map, Observable } from 'rxjs';
import { ToastNotificationsService } from './toast-notifications.service';

export interface CorrectGrammarDto {
  text: string;
}

export interface RephraseDto extends CorrectGrammarDto {}

@Injectable({ providedIn: 'root' })
export class HuggingFaceService {
  private _hf: HfInference;
  constructor(
    private readonly _http: HttpClient,
    private readonly toastNotificationService: ToastNotificationsService
  ) {
    this._hf = new HfInference('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');
  }

  public summarizeText(
    text: string,
    maxLength: number = 70
  ): Observable<string> {
    return from(
      this._hf.summarization({
        model: 'facebook/bart-large-cnn',
        inputs: text,
        parameters: {
          max_length: maxLength,
        },
      })
    ).pipe(map(output => output.summary_text));
  }

  public tokenGeneration(
    text: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Observable<string[]> {
    return from(
      this._hf.tokenClassification({
        model: 'yanekyuk/bert-keyword-extractor',
        inputs: text,
      })
    ).pipe(
      map(output => output.map(o => o.word)),
      map(tags => [...new Set(tags)]),
      catchError(err => {
        console.log(err, 'error during token classification');
        this.toastNotificationService.showNotification(
          'error',
          'Token generation service is unavailable'
        );

        return [];
      })
    );
  }

  public correctGrammar(text: string) {
    const dto: CorrectGrammarDto = {
      text,
    };
    return this._http.post('external/correct-grammar', dto);
  }

  public rephrase(text: string) {
    return from(
      this._hf.textGeneration({
        model: 'eshwarZugz/bart_large-rephrase',
        inputs: text,
      })
    ).pipe(map(output => output.generated_text));
  }

  public generateTitle(text: string) {
    return from(
      this._hf
        .textGeneration({
          model: 'czearing/article-title-generator',
          inputs: text,
        })
        .catch(error => {
          console.log(error, 'error');
          return {
            generated_text: '',
          };
        })
    ).pipe(
      map(output => output.generated_text),
      catchError(error => {
        console.log(error);
        return '';
      })
    );
  }
}
