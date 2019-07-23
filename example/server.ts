import * as Koa from "koa";
import { Observable, of } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import KoaRouterRx from "../src";

const run = () => {
  const app = new Koa();

  const router = new KoaRouterRx();
  router.GET("/hello", (requestObservable: Observable<any>) => {
    return requestObservable
      .pipe(
        tap((it) => console.log("GET Logic goes here")),
        map((it) => {
          it.body = {
            status: "success",
            message: "get",
          };
          it.status = 202;
          return it;
        }),
        catchError((error) => {
          console.log("ERROR", error);
          return requestObservable
            .pipe(
              map((it) => {
                it.body = {
                  status: "www",
                  message: "gwwwet",
                };
                it.status = 500;
                return it;
              }),
            );
        }),
      );
  });

  router.POST("/hello2", (requestObservable: Observable<any>) => {
    return requestObservable
      .pipe(
        tap((it) => console.log("POST Logic goes here")),
        switchMap(() => {
          return of({
            status: "success",
            message: "post",
          });
        }),
      );
  });

  app.use(router.routes());

  app.listen(8080, () => console.log(`Server running on port 8080`));

};

run();
