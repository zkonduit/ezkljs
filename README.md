# EZKL

The EZKL library is a set of tools to make integrating the [EZKL](https://github.com/zkonduit/ezkl) engine into your application easier than ever.

---

## Installation

To install EZKL, simply use your favorite package manager:

```shell
# npm
npm install ezkl

# yarn
yarn add ezkl

# pnpm
pnpm add ezkl
```

---

## Hub

To get started using EZKL Hub in your appplication you'll want to use the `router` submodule.

```typescript
import { router } from 'ezkl'
```

The router exposes useful APIs for interfacting with the EZKL Hub.

### Health Check

You can preform a health check on the EZKL Hub by using the `healthCheck` method.

```typescript
const healthStatus = await router.healthCheck()
console.log(healthStatus)
```

if Hub is up and running you should receive a JSON response that looks like:

```json
{
  "res": "Welcome to the ezkl hub's backend!",
  "status": "ok"
}
```

### Artifacts

In order to query the artifacts currently available on the EZKL Hub you can use the `artifacts` method:

```typescript
type Artifact = {
  name: string
  description: string
  id: string
}

const artifacts: Artifact[] = await router.artifacts()

console.log(artifacts)
```

Output:

```
[
  {
    name: 'test',
    description: 'test',
    id: 'b7000626-ed7a-418c-bcf1-ccd10661855a',
  },
  {
    name: 'test',
    description: 'test',
    id: 'e7e92ecf-f020-4603-a908-4b40b7846874',
  },
]
```

### Upload Artifact

If your application requires the use of a model not currently on EZKL Hub, you'll want to upload your own artifact. You can do this by using the `uploadArtifact` method.

In order to upload an artifact you'll need to provide the following:

1. `model.(ezkl|onnx)`: The model you wish to upload in either compiled `.ezkl` format or in `.onnx` format.
2. `settings.json`: The settings for your model in JSON format.
3. `pk.key`: The private key for your model.

This will work with either in a browser client (`File`) or a Node.js (`Buffer`) environent.

```typescript
const modelFile: File | Buffer = fs.readFileSync('/path/model.ezkl')
const settingsFile: File | Buffer = fs.readFileSync('/path/settings.json')
const pkFile: File | Buffer = fs.readFileSync('/path/pk.key')

const uploadArtifactResponse = await router.uploadArtifact(model, settings, pk)

console.log(uploadArtifactResponse)
```

Output:

```
{
  id: '6017cb49-cdb8-4648-9422-c8568de9a2f5'
}
```

### Generate Proof

Once the artifact is on Hub and you have it's `id` and a dataset (`input.json`) you'll be able to use EZKL Hub to generate proofs. This is done in two steps: `initiateProof` and `getProof`.

### Initiate Proof

```typescript
const artifactId: string = '6017cb49-cdb8-4648-9422-c8568de9a2f5'
const input: File | Buffer = fs.readFileSync('/path/input.json')

const initiateProofResponse = await router.initiateProof(artifactId, input)

console.log(initiateProofResponse)
```

Output:

```
{
  taskId: '37cce354-34ba-4d1d-8437-bef8044671e8',
  status: 'PENDING'
}
```

### Get Proof

Once the Hub as finished building your proof you'll be able to retreive it for use:

```typescript
const artifactId: string = '6017cb49-cdb8-4648-9422-c8568de9a2f5'
const input: File | Buffer = fs.readFileSync('/path/input.json')

const initiateProofResponse = await router.getProof(taskkId)

console.log(initiateProofResponse)
```

Output:

```
{
  taskId: '37cce354-34ba-4d1d-8437-bef8044671e8',
  status: 'PENDING'
}
```
