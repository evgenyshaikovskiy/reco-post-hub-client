import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { IPublicTopic } from '../../core/interfaces/request-interfaces';
import { TopicPageService } from './topic.service';
import { inject } from '@angular/core';
import { ToastNotificationsService } from '../../core/services/toast-notifications.service';
import { SpinnerService } from '../../core/services/spinner.service';
import { catchError, finalize, of } from 'rxjs';

export const topicPageResolver: ResolveFn<IPublicTopic | null> = (
  route: ActivatedRouteSnapshot
) => {
  const topicService = inject(TopicPageService);
  const notificationService = inject(ToastNotificationsService);
  const spinnerService = inject(SpinnerService);
  const router = inject(Router);

  spinnerService.changeLoadingState(true);

  return topicService.getTopicByUrl(route.paramMap.get('url')!).pipe(
    catchError(error => {
      console.log(error);
      notificationService.showNotification('error', 'Topic not found!');
      router.navigate(['']);
      return of(null);
    }),
    finalize(() => spinnerService.changeLoadingState(false))
  );
};
