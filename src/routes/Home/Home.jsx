import { Table } from "baseui/table-semantic";
import { Button, KIND } from "baseui/button";
import {Heading, HeadingLevel} from 'baseui/heading';
import { useAuthContext } from 'AuthContext';
import { useGraphQL } from 'GraphQLContext';
import { gql } from 'graphql-request';
import { useQuery } from 'react-query';
import { DateTime } from 'luxon';
import CreateNewSandbox from "./CreateNewSandbox";

const sandboxesQuery = gql`
query listSandboxes {
  listSandboxes {
    sandboxes {
      __typename
      ... on CloudSandbox {
        id
        assignedTo
        assignedSince
        assignedUntil
        state
      }
      ... on AwsSandbox {
        AwsDetails {
          accountId
          accountName
        }
      }
    }
  }
}
`

const getDateString = (datetime) => {
    const dt = DateTime.fromISO(datetime);
    const time = dt.toLocaleString(DateTime.TIME_SIMPLE);
    const date = dt.setLocale().toFormat("dd'.'LL'.'yyyy");
    return `${date}, ${time}`;
};

const Home = () => {
    const auth = useAuthContext();
    const client = useGraphQL();
    const { isSuccess, data, isFetching, refetch } = useQuery('sandboxList', async () => {
        const { listSandboxes } = await client.request(sandboxesQuery);
        return listSandboxes
    });
    const handleOnClick = () => {
        refetch();
    }
    console.log(data);
    return (
        <HeadingLevel>
            <CreateNewSandbox refetch={refetch} />
            <Heading styleLevel={5}>My Sandboxes</Heading>
            {isSuccess &&
                <Table
                    columns={["Cloud", "State", "Assigned To", "Assigned Since", "Assigned Until"]}
                    data={data.sandboxes.filter(sandbox => sandbox.assignedTo === auth.email).map(sandbox => {
                        return [
                            sandbox.__typename === "AwsSandbox" ? "AWS" : "AZURE",
                            sandbox.state,
                            sandbox.assignedTo,
                            getDateString(sandbox.assignedSince),
                            getDateString(sandbox.assignedUntil)
                        ]
                    })}
                />
            }
            <Button
                isLoading={isFetching}
                kind={KIND.secondary}
                onClick={handleOnClick}
                overrides={{
                    BaseButton: {
                        style: ({ $theme }) => {
                            return {
                                marginTop: $theme.sizing.scale600,
                            }
                        }
                    }
                }}
            >
                Refresh
            </Button>
        </HeadingLevel>
    )
}

export default Home;