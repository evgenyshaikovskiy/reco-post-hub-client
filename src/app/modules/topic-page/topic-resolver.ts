import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { IComment, ITopic } from '../../core/interfaces/request-interfaces';
import { TopicPageService } from '../../core/services/topic.service';
import { inject } from '@angular/core';
import { ToastNotificationsService } from '../../core/services/toast-notifications.service';
import { catchError, finalize, map, of, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { setSpinnerState } from '../../store/actions';

export const topicPageResolver: ResolveFn<
  { topic: ITopic; comments: IComment[] } | null
> = (route: ActivatedRouteSnapshot) => {
  const topicService = inject(TopicPageService);
  const notificationService = inject(ToastNotificationsService);
  const router = inject(Router);
  const store = inject(Store);

  store.dispatch(setSpinnerState({ state: true }));

  return topicService.getTopicByUrl(route.paramMap.get('url')!).pipe(
    switchMap(topic =>
      topicService
        .getTopicComments(topic.topicId)
        .pipe(map(comments => ({ comments: comments, topic: topic })))
    ),
    catchError(error => {
      console.log(error);
      notificationService.showNotification('error', 'Topic not found!');
      router.navigate(['']);
      return of(null);
    }),
    finalize(() => store.dispatch(setSpinnerState({ state: false })))
  );
};
