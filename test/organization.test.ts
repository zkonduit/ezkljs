import hub from '../src/'

// import path from 'path'
// import fs from 'node:fs/promises'

const baseUrl = 'https://hub-staging.ezkl.xyz' as const
const gqlUrl = `${baseUrl}/graphql` as const
const organizationId = '10f565e2-803b-4fe8-b70e-387de38b4cf5'

describe('organization', () => {
  it('gets an organization by name', async () => {
    const org = await hub.getOrganization({
      url: gqlUrl,
      name: 'currenthandle',
    })
    expect(org?.name).toEqual('currenthandle')
    expect(org?.id).toEqual(organizationId)
  })
  it('gets an organization by id', async () => {
    const org = await hub.getOrganization({
      url: gqlUrl,
      id: organizationId,
    })
    expect(org?.name).toEqual('currenthandle')
    expect(org?.id).toEqual(organizationId)
  })
})
