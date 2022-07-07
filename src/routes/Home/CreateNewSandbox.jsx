import { useState } from 'react';
import { Button, KIND } from "baseui/button";
import { FormControl } from 'baseui/form-control';
import { RadioGroup, Radio } from 'baseui/radio';
import { DatePicker } from "baseui/datepicker";
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalButton } from 'baseui/modal';
import { Plus } from 'baseui/icon';
import { useMutation } from 'react-query';
import { gql } from 'graphql-request'
import { useGraphQL } from 'GraphQLContext';

const leaseSandboxMutation = gql`
mutation($cloud: Cloud!, $leaseTime: String!) {
  leaseSandBox(cloud: $cloud , leaseTime: $leaseTime) {
    ... on CloudSandbox {
      state
    }
  }
}
`;

const CreateNewSandbox = (props) => {
    const [radioValue, setRadioValue] = useState('AWS');
    const [dateValue, setDateValue] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const client = useGraphQL();
    const { mutate, isLoading } = useMutation(async () => {
        const data = await client.request(leaseSandboxMutation, {
            cloud: radioValue,
            leaseTime: dateValue.toISOString(),
        });
    }, {
        onSuccess: () => {
            setRadioValue('AWS');
            setDateValue(new Date());
            closeModal();
            props.refetch();
        }
    });
    const handleDateChange = ({ date }) => {
        setDateValue(date);
    }
    const handleOpenModalButtonClick = () => {
        openModal();
    };
    const handleCreateButtonClick = () => {
        mutate();
        console.log(dateValue);
    }
    const openModal = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };
    return (
        <>
            <Button onClick={handleOpenModalButtonClick} startEnhancer={() => <Plus size={24} />}>Create New Sandbox</Button>
            <Modal onClose={closeModal} isOpen={isModalOpen}>
                <ModalHeader>New Sandbox</ModalHeader>
                <ModalBody>
                    <FormControl
                        label="Cloud"
                    >
                        <RadioGroup
                            value={radioValue}
                            onChange={event => setRadioValue(event.currentTarget.value)}
                        >
                            <Radio value="AWS">AWS</Radio>
                            <Radio value="AZURE">Azure</Radio>
                        </RadioGroup>
                    </FormControl>
                    <FormControl label="Valid Until">
                        <DatePicker onChange={handleDateChange} value={dateValue} />
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <ModalButton kind="tertiary" onClick={closeModal}>Cancel</ModalButton>
                    <ModalButton isLoading={isLoading} onClick={handleCreateButtonClick}>Create</ModalButton>
                </ModalFooter>
            </Modal>
        </>
    );
}

export default CreateNewSandbox;
