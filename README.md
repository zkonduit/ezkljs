# EZKL

The EZKL library is a set of tools to make integrating the [EZKL](https://github.com/zkonduit/ezkl) engine into your application easier than ever.

---

## Installation

To install EZKL, simply use your favorite package manager:

```shell
# npm
npm install @ezkljs/hub

# yarn
yarn add @ezkljs/hub

# pnpm
pnpm add @ezkljs/hub
```

---

## Development

To test and develop the library you will need to run the following

```shell
# pnpm
pnpm i
pnpm build
pnpm test
```

---

## Hub ([example usage in Next.js](https://github.com/zkonduit/ezkljs/tree/main/examples/router))

To get started using EZKL Hub in your appplication you'll want to use the `router` submodule.

```typescript
import hub from '@ezkljs/hub'
```

The router exposes useful APIs for interfacting with the EZKL Hub:

- [healthCheck](#health-check): Check the health of the EZKL Hub.
- [getOrganization](#get-organization): Get an organization, by id or by name.
- [getArtifact](#get-artifact): Get a artifact, by id or by name and organization-name.
- [getArtifacts](#get-artifacts): Get a list of artifacts currently on the EZKL Hub.
- [Upload Compiled Circuit (uploadArtifact)](#upload-compiled-circuit): Upload a compiled ezkl circuit to create an artifact on EZLL Hub.
- [Upload ONNX Model (genArtifact)](#upload-onnx-model): Upload a onnx model to create an artifact on the EZKL Hub.
- [initiateProof](#initiate-proof): Initiate a proof generation task.
- [getProof](#get-proof): Get the result of a proof generation task.

---

### Health Check

You can preform a health check on the EZKL Hub by using the `healthCheck` method.
You can provide an optional url if you're using a custom EZKL Hub instance.

```typescript
const healthStatus = await hub.healthCheck({ url: 'https://hub.ezkl.xyz' })

console.log(JSON.stringify(healthStatus, null, 2))
```

Output:

```json
{
  "res": "Welcome to the ezkl hub's backend!",
  "status": "ok"
}
```

---

### Get Organination

To get an organization you can use the `getOrganization` method. All users accounts have their own organization as well. All organizations have unique `id` and `name` properties.

You can query an organization by `id` or `name`.

You can also provide an optional url to specifiy an EZKL Hub backend.

```typescript
type Organization = {
  id: string
  name: string
  url?: string
}
```

````typescript
const organization: Organization = await hub.getOrganization({
  id: 'b7000626-ed7a-418c-bcf1-ccd10661855a'
})

// or

const organization: Organization = await hub.getOrganization({
  name: 'test'
})

console.log(JSON.stringify(organization, null, 2))
```

Output:

```json
{
  "id": "b7000626-ed7a-418c-bcf1-ccd10661855a",
  "name": "test"
}
````

---

### Get Artifact

To get a single artifact you can use the `getArtifact` method. All artifacts have unique `id`. An artifact is also uniquly queried by a combination of `name` and `organization-name`.

````typescript
const artifact = await hub.getArtifact({
  id: 'b7000626-ed7a-418c-bcf1-ccd10661855a',
})

// or

const artifact = await hub.getArtifact({
  name: 'test',
  organizationName: 'test',
})

```

### Get Artifacts

In order to query the artifacts currently available on the EZKL Hub you can use the `getArtifacts` method.

This method accepts an options object which allows you to specify the `limit` (the max number of artifacts to return) and `skip` (the number of artifacts to skip). `skip` and `limit` can be used together for effective pagination. If no options are provided, the default values are `skip = 0` and `limit = 20`.

```typescript
type Artifact = {
  name: string
  description: string
  id: string
}

type PageOptions =
  | {
      skip?: number
      limit?: number
    }
  | undefined

const pageOptions: PageOptions = {
  skip: 0,
  limit: 2,
  url: 'https://hub.ezkl.xyz',
}

const artifacts: Artifact[] = await hub.getArtifacts(pageOptions)

console.log(JSON.stringify(artifacts), null, 2)
````

Output:

```json
[
  {
    "name": "test",
    "description": "test",
    "id": "b7000626-ed7a-418c-bcf1-ccd10661855a"
  },
  {
    "name": "test",
    "description": "test",
    "id": "e7e92ecf-f020-4603-a908-4b40b7846874"
  }
]
```

---

### Upload Compiled Circuit

If your application requires the use of a model not currently on EZKL Hub, you'll want to upload your own artifact. You can do this by using the `uploadArtifact` method.

In order to upload an artifact you'll need to provide the following:

1. `name`: The name of your artifact.
2. `description`: A description of your artifact.
3. `organizationId`: The organization you wish to upload your artifact to.
4. `modelFile`: The model you wish to upload in compiled `.ezkl` format.
5. `settingsFile`: The settings for your model in JSON format.
6. `pkFile`: The proving key for your model.
7. `url` you can provide an optional url if you're using a custom EZKL Hub instance

This will work with either in a browser client (`File`) or a Node.js (`Buffer`) environent.

```typescript
const name: string = 'My Artifact Name'
const description: string = 'My Artifact Description'
const organizationId: string = 'b7000626-ed7a-418c-bcf1-ccd10661855a' // uuid
const modelFile: File | Buffer = fs.readFileSync('/path/model.ezkl')
const settingsFile: File | Buffer = fs.readFileSync('/path/settings.json')
const pkFile: File | Buffer = fs.readFileSync('/path/pk.key')
const url: string = 'https://hub.ezkl.xyz'

const uploadArtifactResponse = await hub.uploadArtifact({
  name,
  description,
  organizationId,
  url,
  modelFile,
  settingsFile,
  pkFile,
  url,
})

console.log(JSON.stringify(uploadArtifactResponse), null, 2)
```

Output:

```json
{
  "id": "6017cb49-cdb8-4648-9422-c8568de9a2f5"
}
```

---

### Upload ONNX Model

Another option is to upload an uncompiled `ONNX` model and let Hub compile your circuit with default settings. You can do this by using the `genArtifact` method.

In order to upload an artifact you'll need to provide the following:

1. `name`: The name of your artifact.
2. `description`: A description of your artifact.
3. `organizationId`: The organization you wish to upload your artifact to.
4. `modelFile`: The model you wish to upload in `.onnx` format.
5. `inputFile`: A representative input file in JSON format.
6. `url` you can provide an optional url if you're using a custom EZKL Hub instance

This will work with either in a browser client (`File`) or a Node.js (`Buffer`) environent.

```typescript
const name: string = 'My Artifact Name'
const description: string = 'My Artifact Description'
const organizationId: string = 'b7000626-ed7a-418c-bcf1-ccd10661855a' // uuid
const modelFile: File | Buffer = fs.readFileSync('/path/model.onnx')
const inputFile: File | Buffer = fs.readFileSync('/path/input.json')
const url: string = 'https://hub.ezkl.xyz'

const genArtifactResponse = await hub.genArtifact({
  name,
  description,
  organizationId,
  url,
  modelFile,
  inputFile,
  url,
})

console.log(JSON.stringify(genArtifactResponse), null, 2)
```

Output:

```json
{
  "id": "6017cb49-cdb8-4648-9422-c8568de9a2f5"
}
```

---

### Generate Proof

Once the artifact is on Hub and you have it's `id` and a dataset (`input.json`) you'll be able to use EZKL Hub to generate proofs. This is done in two steps: `initiateProof` and `getProof`.

---

### Initiate Proof

```typescript
const id: string = '6017cb49-cdb8-4648-9422-c8568de9a2f5' // uuid
const inputFile: File | Buffer = fs.readFileSync('/path/input.json')
// you can provide an optional url if you're using a custom EZKL Hub instance
const url: string = 'https://hub.ezkl.xyz'

const initiateProofResponse = await hub.initiateProof({ id, inputFile, url })

console.log(JSON.stringify(initiateProofResponse), null, 2)
```

Output:

```json
{
  "id": "37cce354-34ba-4d1d-8437-bef8044671e8",
  "status": "PENDING"
}
```

---

### Get Proof

Once the Hub as finished building your proof you'll be able to retreive it for use:

```typescript
const id: string = 'c4b049c3-9770-45cf-b8ec-1bee0efc8347' // uuid
// you can provide an optional url if you're using a custom EZKL Hub instance
const url: string = 'https://hub.ezkl.xyz'

const getProofResponse = await hub.getProof({ id, url })

console.log(JSON.stringify(getProofResponse), null, 2)
```

Output:

```json
{
  "taskId": "c4b049c3-9770-45cf-b8ec-1bee0efc8347",
  "status": "SUCCESS",
  "proof": "1d67f0661328e1f1dea0c382ab82d6f8be050f77d5fcb76ab1efac05d999fc56118cc6dbe05b3c181a04e3993c95b5342f65946411419c6ace7f65d2d47a37a32893ca803968a5f873223bf8daef4a504acad8587b2eb66d60b581bee2b0561126653e67324a75995dd54acda945962de93caa624c8ec2dc0eecf4e961b9630f08d787c655f8ff09eb24a67ffbdeeda3d9f037221a8b9f3880d48d2898ec6b9b17dbda93d85077483fe9d982d3824809f01df7cbb38819eef6ebfea5a2ee349a219ec4ae531c385c4c09704840675407fa6ed3d70077fa0ed4ebaf3f7a61bf9508f8a25a43ef58736d1894607246a30b7004e83683e9a55d4c4a780a47cfaff003298f8c55d4cfcc8958c19deec7e03058ebb20fed906c820f8668a0200441740cbef078b2797fcc427e93a3a0b6091042551b778abca83f020e83644e03f5eb164f1f2bfac8f9691b1d9397ef4c3a6c1b4253f6826c825779252a2562a500ae1a6b967b01a121a094b1d4e4a038068f517b43a1df5bf38c163e2b41083ce41c131f4d9d6c9397331a78e5c445eb88e8bea6a37b92db78cd445348f6749e00792643db2aeac27cedb48de8896d55d240c0625c6c6877aae0a43599a822bf89f8221706d6d250afe9ea245db42b0c0e70ca4d64c4eb8fc81139a1d08e001159a028e28a700276d6b5792c393ce4504329964e43729b805201e56ee7100ae5e3d8094bb419a59c1c81ac0720763144f73d5fde4adb2602e2bf4df92d1b53593c8c060a07ca13eda54cd6578d4ad7d1417fd501b43bed04402d846c803ee814ba291cded686abdc65afef7c30851c0ad66852a8fc9f9e2f0940f4546c7869a0fdaf300a9752155c5b789943458eacca481e096478aafedaaba2badec5b2d52a35382a8896d98e5ed6d648ee95077f3e26f24d160c861be66eec4d2f427fb6b348a02b5f55322370fbcb4cc88fe71b2d93581357cae84f0515b97ea147c932edc58b257a0b1c1b42dde6ab85a513d6cd48bfb316bb356f7541b31852309ab6a9c5b801e0db0349048d18dd39dfa2c68d2e68d3169eba63dda934ffcfadc107593f5b181627a10539a85748e44dcdc7cfc13d7b97511db10c19dd1262cd65379710f41879c30ceb25a31324a2417794062cc75c6b63ef8c203f8bbd2eff698f721d612e01f11245ee956f467b67b9ec57c485de4baacb4e1c004de321820c99b1eb9200e224413250a72ea310be8b9add05528437c7135c5d0bd5bd964e3358a870430ef7502f5a6c4f35193d8a8ac0edaa0f03850b5abb711918945ba4c49cbca7a909e762aad24095995620796fd93e8f7123df609612afd1dda86cbe314c48e61900000000000000000000000000000000000000000000000000000000000000000cf3dd8f1f52499bbc22ad9e28fc9a9d15a37921a75e83be1686a659331dbd2c2232bd82f966db77520289a6c6fdbf9f54f68701297f94845c55b1942ee7ae9b19f153f11e42ca0ee4fe75585a9f45f5dd783e36bc3a1106992591c1666026351d6300c20efda87fe2b23ac0a651e8e3a3a610a1948725e0ba56783e8f861c461ba82bd16b1b147a5d1027c88cd49121c284f53ff7015622d7d7c93500cc850b0283edc21d34b6664ef6c52287a5a6ce37fbe6e408b5eff8e30309e9eff1ea5200000000000000000000000000000000000000000000000000000000000000001a7f2f59dafbc549616c3b4b6ea4fc0b6128f63d7e7d1348e405e06f3ae315b500488c3c522f60e58d6ca9dc2eab212fcbf7efed2e172dba25ed857caf9e148000e84f8bbbe5fb938fe319b7b4cda6aec3511ebf1d4cda2e71fe8eee3de34cb220a4beeda777c60ddcbb85f11143975ee0cd5061c3284057afd3de15a3af2e041f87d06e1d1b69237cc1484c04cfc0f7f63b8a3cd1780ea4ba9ee10213e7f6d40d2734c2468a8fe32733a46651853325a516ab202e1bf051cb142cccbd957d2125a938104c52c814e2ac534bed23935ed55b6bc12a1d2de4788cb389e73658961072ee9ada34862e9098049035cada7809b1851466b8b56fdd9dd8f5a922f80f0af3dc6eeffe2b0bd8f843375045d7c40f465cf120a318e368ef22bba2eab63c2a847f8c447d8da76605c3df75aa5f5d13cd7a2b80e804bdb3ec6d42909e98dc1534b2b0c1fe686a4e02c9f540705292e7ea73192e2c782e0ffbc3dafdaae3500c9bf332f80106737fd98fa5edfc015595d8790adbe1ee894debb2a07c35db9d017ab8af09c40263150b3a1b64444e4342edaab7bff74fe849bdcb0efa3e5e560698cd72c8056216e25d8e54f0dc34a09230aad65982b113112e251b866787562c13a8c7f0e67448ff60deb37844559ec8a5ef0c684c7a955d32e153e560e654144d35e0a0e6628f881ad2c43bf0f1d15ebe1926b1d458ab7cc9ae9e942a70630a95714d22ec598b1aa24e1f76f699e181d3b62ce59ebadd8bb3322e707a90b206dd6d591ccb0b20a23812c3bb7925065b20c9d7ab02384d8bcf7c72aaba1ec42fbb6e89bec76b2ef41e717f3dcf15626a1d4bf65657cd9b0d57be7b9a73d39f000b77dcac7731f3b41751566f76a4a40f52e62fd2b6993567b817a27c31a7f025ba97772c9380f627b9283109b2e00617777d86ce3a0d40b4436576a71670191e2ebbb5076e7e10bc78cb4739eba8ac2fcde91ee691cf332382654846d9c8f72c66c2d65a40bd1a12a0fdc1904465b8c9e5969d81c5756caaee34b1f2479f240e60bab56f3e2f2ec3102d2ecb270572524deda16cf8b652230738b77f23f136",
  "witness": {
    "inputs": [
      [
        [25, 0, 0, 0],
        [9, 0, 0, 0],
        [19, 0, 0, 0]
      ]
    ],
    "outputs": [
      [
        [5, 0, 0, 0],
        [10, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ]
    ],
    "maxLookupInputs": 362
  }
}
```
