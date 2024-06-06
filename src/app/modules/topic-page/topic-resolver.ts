import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { IComment, ITopic } from '../../core/interfaces/request-interfaces';
import { TopicPageService } from '../../core/services/topic.service';
import { inject } from '@angular/core';
import { ToastNotificationsService } from '../../core/services/toast-notifications.service';
import { catchError, finalize, map, of, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { setSpinnerState } from '../../store/actions';
import { AuthService } from '../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

export const topicPageResolver: ResolveFn<
  { topic: ITopic; comments: IComment[] } | null
> = (route: ActivatedRouteSnapshot) => {
  const topicService = inject(TopicPageService);
  const notificationService = inject(ToastNotificationsService);
  const router = inject(Router);
  const store = inject(Store);
  const authService = inject(AuthService);

  store.dispatch(setSpinnerState({ state: true }));

  return topicService.getTopicByUrl(route.paramMap.get('url')!).pipe(
    map(topic => {
      const user = authService.User;
      const notAllowedToViewUnpublished = !authService.isAllowedToReviewTopic;
      if (!topic.published && !user) {
        throw new Error('Unauthorized users cannot view this article.');
      }

      if (!topic.published && notAllowedToViewUnpublished) {
        throw new Error('You cannot view this article.');
      }

      return { topic };
    }),
    switchMap(topic =>
      topicService
        .getComments(topic.topic.topicId)
        .pipe(map(comments => ({ comments: comments, topic: topic.topic })))
    ),
    catchError(error => {
      const message = (error as HttpErrorResponse)
        ? (error as HttpErrorResponse).error['message']
        : (error as string);
      notificationService.showNotification('error', message);
      router.navigate(['']);
      return of(null);
    }),
    finalize(() => store.dispatch(setSpinnerState({ state: false })))
  );
};
