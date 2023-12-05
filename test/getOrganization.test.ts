import hub from '../src'
import { GQL_URL, ORG_ID } from '../src/utils/constants'

describe('organization', () => {
  it('gets an organization by name', async () => {
    const org = await hub.getOrganization({
      url: GQL_URL,
      name: 'currenthandle',
    })
    expect(org?.name).toEqual('currenthandle')
    expect(org?.id).toEqual(ORG_ID)
  })
  it('gets an organization by id', async () => {
    const org = await hub.getOrganization({
      url: GQL_URL,
      id: ORG_ID,
    })
    expect(org?.name).toEqual('currenthandle')
    expect(org?.id).toEqual(ORG_ID)
  })
})
