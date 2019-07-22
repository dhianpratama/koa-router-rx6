import { Context } from "koa";
import * as Router from "koa-router";
import { Observable, of } from "rxjs";

type Epic<A, B> = (observable: Observable<A>) => Observable<B>;

enum HttpMethod {
  GET, POST, PUT, PATCH, DELETE, OPTIONS,
}

class KoaRouterRx extends Router {

  constructor (...args: any[]) {
    super(...args);
  }

  public GET<B> (path: string, epic: Epic<object, B>) {
    this._handleRequest(HttpMethod.GET, path, epic);
  }

  public POST<B> (path: string, epic: Epic<object, B>) {
    this._handleRequest(HttpMethod.POST, path, epic);
  }

  public PUT<B> (path: string, epic: Epic<object, B>) {
    this._handleRequest(HttpMethod.PUT, path, epic);
  }

  public PATCH<B> (path: string, epic: Epic<object, B>) {
    this._handleRequest(HttpMethod.PATCH, path, epic);
  }

  public DELETE<B> (path: string, epic: Epic<object, B>) {
    this._handleRequest(HttpMethod.DELETE, path, epic);
  }

  public OPTIONS<B> (path: string, epic: Epic<object, B>) {
    this._handleRequest(HttpMethod.OPTIONS, path, epic);
  }

  private _handleContext<B> (epic: Epic<object, B>) {
    return (ctx: Context) => {
      epic(of(ctx))
        .subscribe(
          (payload) => {
            ctx.response.status = ctx.response.status !== 404 ? ctx.response.status : 200;
            ctx.response.body = payload;
          },
          (err: Error) => {
            ctx.response.status = ctx.response.status !== 404 ? ctx.response.status : 500;
            ctx.response.body = err.stack;
          },
        );
    };
  }

  private _handleRequest<B> (method: HttpMethod, path: string, epic: Epic<object, B>) {
    switch (method) {
      case HttpMethod.GET:
        this.get(path, this._handleContext(epic));
        break;

      case HttpMethod.POST:
        this.post(path, this._handleContext(epic));
        break;

      case HttpMethod.PUT:
        this.put(path, this._handleContext(epic));
        break;

      case HttpMethod.DELETE:
        this.delete(path, this._handleContext(epic));
        break;

      case HttpMethod.PATCH:
        this.patch(path, this._handleContext(epic));
        break;

      case HttpMethod.OPTIONS:
        this.options(path, this._handleContext(epic));
        break;
    }
  }

}

export { KoaRouterRx };
