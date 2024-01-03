import { Header } from "./Header";
import { Footer } from "./Footer";
import { Flex } from "@chakra-ui/layout";

import { LayoutChildrenProps } from "@/types";

export const Layout = ({ children }: LayoutChildrenProps) => {
    return (
        <Flex
            height="100vh"
            direction="column"
            justifyContent="space-between"
            alignItems="center"
        >
            <Header />
            <Flex
                p="2rem"
                direction="column"
                width="100%"
            >
                {children}
            </Flex>
            <Footer />
        </Flex>
    )
};