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
- [getArtifactSettings](#get-artifact-settings): Get the settings for an artifact.
- [initiateProof](#initiate-proof): Initiate a proof generation task.
- [getProof](#get-proof): Get the result of a proof generation task.
- [getProofs](#get-proofs): Get the proofs assocaited with an artifact.
- [deleteProof](#delete-proof): Delete a proof.

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

```typescript
const organization: Organization = await hub.getOrganization({
  id: 'b7000626-ed7a-418c-bcf1-ccd10661855a',
})

// or

const organization: Organization = await hub.getOrganization({
  name: 'test',
})

console.log(JSON.stringify(organization, null, 2))
```

Output:

```json
{
  "id": "b7000626-ed7a-418c-bcf1-ccd10661855a",
  "name": "test"
}
```

---

### Get Artifact

To get a single artifact you can use the `getArtifact` method. All artifacts have unique `id`. An artifact is also uniquly queried by a combination of `name` and `organization-name`.

```typescript
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

To query the artifacts for an organization you can use the `getArtifacts` method. An organization is uniquly identified by either `organizationId` or `organizationName`. You can choose to provide either.

You can also provide an optional url to specifiy an EZKL Hub backend. `getArtifacts` also accepts `first` and `skip` options to paginate the results.

```typescript
const pageOptions: PageOptions = {
  organizationName: 'test', // or organizationId
  skip: 0,
  limit: 200,
  url: 'https://hub.ezkl.xyz',
}

const artifacts: Artifact[] = await hub.getArtifacts(pageOptions)
```

### Artifact Settings.json

Get an artifacts `settings.json` configutation file with `getArtifactSettings`.

`genArtifactSettings` takes an artifact `id` and an optional `url`.

```typescript
const settings = await hub.getArtifactSettings({
  id: 'b7000626-ed7a-418c-bcf1-ccd10661855a',
})
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
  "proof": "1d67f066170572524de...da16cf8b652230738b77f23f136",
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

### Get Proofs

To get a link of proofs associated with an artifact you can use the `getProofs` method. To get the proofs you pass in the `artifactName` and `organizationName` of the artifact you want to get the proofs for. You can also provide an optional url to specifiy an EZKL Hub backend. `getProofs` also accepts `first` and `skip` options to paginate the results.

```typescript
await hub.getProofs({
  artifactName: 'test',
  organizationName: 'test',
  first: 10,
  skip: 0,
  url: 'https://hub.ezkl.xyz',
})
```

### Delete Proof

To delete a proof use the `deleteProof` method passing in the `proofId` and the `organizationName`. You can provide an optional url to specifiy an EZKL Hub backend.

```typescript
await hub.deleteProof({
  proofId: 'c4b049c3-9770-45cf-b8ec-1bee0efc8347',
  organizationName: 'my-organization',
  url: 'https://hub.ezkl.xyz',
})
```
