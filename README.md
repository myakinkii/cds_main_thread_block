## sap cap main tx blocking test repo
We use chat gpt call that takes around 10 seconds to see if it cds blocks main thread

**TL;DR** Whenever we join automatic transaction, we ~~block main thread~~ can be blocked at acquire until COMMIT is done

_Forgot tha fact that sqlite is single user, so the whole db is busy performing a transaction.
In case of other dbs this might potentially also have impact depending on number of simultaneous users._

We can revert to [manual transations](https://cap.cloud.sap/docs/node.js/cds-tx#manual-transactions) (unless we have draft-bound action) to make it COMMIT before doing slow request

### Spotted results
- **cds7 + lean drafts both enabled and disabled** blocks if bound action is called on draft entity
- **cds6** does as well
- but **cds5** does not

## howto 

- clone this into your srv folder of project you want to test (or rather use sample and test scripts here)
- if you use ``index.cds`` for srv add our new service there ``using from './cds_main_thread_block/gpt-service';``
- add ``openai`` as dependency and add your OPENAI_API_KEY to ``.env``
- also set MAKE_IT_BLOCK as any string in ``.env`` to see the difference
- run cds the way you prefer
- test your cds version with requests from ``test.http``
- or just use [$fiori preview](http://localhost:4004/$fiori-preview/gpt.ChatGptService/dummy#preview-app)
