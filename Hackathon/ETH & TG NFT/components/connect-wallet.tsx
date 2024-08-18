"use client";
import { useEffect, useMemo, useState } from "react";
import { useAddWalletAddressMutation, useCurrentUser } from "@/hooks/useUser";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useTonConnect } from "@repo/ton-hooks";
import {
  useTonAddress,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";

interface ConnectWalletProps {
  handleMint?: () => void;
  btnText?: string;
}

export default function ConnectWallet({
  handleMint,
  btnText,
}: ConnectWalletProps) {
  const { connected } = useTonConnect();
  const [tonConnectUI] = useTonConnectUI();
  const address = useTonAddress();
  const shortAddress = useMemo(() => {
    return address ? `${address.slice(0, 6)}...${address.slice(-8)}` : "";
  }, [address]);

  const [seconds, setSeconds] = useState(3);
  const { data: currentUser, isLoading } = useCurrentUser();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const { mutate: addAddress } = useAddWalletAddressMutation();

  const boundAddress = useMemo(() => {
    if (!currentUser) return undefined;
    return currentUser.walletAddresses[0]?.address;
  }, [currentUser]);

  const isButtonDisabled = useMemo(() => {
    return isLoading || seconds !== 0;
  }, [isLoading, seconds]);

  useEffect(() => {
    if (isOpen && connected && address) {
      onClose();
    }
  }, [connected, isOpen, address]);

  useEffect(() => {
    if (!isOpen) {
      setSeconds(3);
    }
    const interval = setInterval(() => {
      if (seconds > 0 && isOpen) {
        setSeconds(seconds - 1);
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, seconds]);

  // 没有登录并且没有绑定过钱包地址时 给弹框提示
  if (!address && !boundAddress) {
    return (
      <>
        <Button className="w-full " color="primary" onPress={onOpen}>
          Connect Wallet
        </Button>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="bottom-center"
          backdrop="blur"
          hideCloseButton
          isDismissable={false}
          classNames={{
            footer: "justify-center",
          }}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Link Wallet notification
                </ModalHeader>
                <ModalBody>
                  <p>
                    The current account will be bound to the wallet account
                    associated by you at the first time. Please make sure your
                    wallet address is correct to avoid unnecessary losses.
                  </p>
                  {seconds > 0 && (
                    <p className="text-center text-xl font-semibold">
                      {seconds}
                    </p>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    disabled={isButtonDisabled}
                    color={isButtonDisabled ? "default" : "primary"}
                    onPress={() => {
                      if (isButtonDisabled) return;
                      tonConnectUI.openModal();
                    }}
                  >
                    Link
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  }
  return (
    <>
      {address ? (
        <Button
          className="w-full"
          color="primary"
          onClick={() => handleMint?.()}
        >
          {btnText ?? shortAddress}
        </Button>
      ) : (
        <Button
          className="w-full"
          color="primary"
          onClick={() => tonConnectUI.openModal()}
        >
          Connect Wallet
        </Button>
      )}
    </>
  );
}
