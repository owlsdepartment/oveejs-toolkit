import { EnvsMain, EnvsAspect } from '@teambit/envs'
import { HtmlAspect, HtmlMain } from '@teambit/html'

export class OveeExtension {
  constructor(private html: HtmlMain) {}

  static dependencies: any = [EnvsAspect, HtmlAspect]

  static async provider([envs, html]: [EnvsMain, HtmlMain]) {
    const OveeEnv = html.compose([
      /*
        Use any of the "html.override..." transformers to
      */
    ])

    envs.registerEnv(OveeEnv)

    return new OveeExtension(html)
  }
}
