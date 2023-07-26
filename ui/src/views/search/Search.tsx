// Copyright 2023 Datav.io Team
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Box, Flex, HStack, IconButton, Input, Modal, ModalBody, ModalContent, ModalHeader, Text, Tooltip, useColorModeValue, useDisclosure } from "@chakra-ui/react"
import React, { memo,  useMemo, useState } from "react"
import { FaSearch, FaTimes } from "react-icons/fa"
import { useSearchParam } from "react-use"
import { Dashboard } from "types/dashboard"
import { requestApi } from "utils/axios/request"
import { addParamToUrl } from "utils/url"
import { RxLetterCaseCapitalize } from "react-icons/rx";
import SearchResults from "./SearchResults"

interface Props {
    title: string
    miniMode: boolean
    fontSize?: number
    fontWeight?: number
    sideWidth?: number
}
const Search = memo((props: Props) => {
    const { title, miniMode, fontSize = 15, fontWeight = 400, sideWidth = 0 } = props
    const [query, setQuery] = useState<string>(null)
    const [caseSensitive, setCaseSensitive] = useState<boolean>(false)
    const [rawDashboards, setRawDashboards] = useState<Dashboard[]>(null)

    const { isOpen, onOpen, onClose } = useDisclosure()

    const onSearchOpen = async () => {
        const res = await requestApi.get(`/dashboard/simpleList`)
        setRawDashboards(res.data)
        onOpen()
    }



    const urlQuery = useSearchParam('search')
    if (urlQuery && query === null) {
        onSearchOpen()
        setQuery(urlQuery)
    }

    const onQueryChange = (v) => {
        addParamToUrl({
            search: v
        })
        setQuery(v)
    }

    const dashboards = useMemo(() => {
        const result = []
        if (!rawDashboards) {
            return result
        }
        const target = rawDashboards
        for (const dash of target) {
            const id = caseSensitive ? dash.id.toString() : dash.id.toString().toLowerCase()
            const title = caseSensitive ? dash.title : dash.title.toLowerCase()
            const q = caseSensitive ? query : query?.toLowerCase()
            if (id.includes(q) || title.includes(q)) {
                result.push(dash)
            }
        }

        return result
    }, [query, rawDashboards, caseSensitive])

    console.log("here33333 result dashboard:", query, dashboards)
    return (
        <>
            <HStack color={isOpen ? useColorModeValue("brand.500", "brand.200") : 'inherit'} className="hover-text" cursor="pointer">
                <Box onClick={onSearchOpen}>
                    {miniMode ?
                        <IconButton fontSize={"1.2rem"} aria-label="" variant="ghost" color="current" _focus={{ border: null }} icon={<FaSearch />} />
                        : <FaSearch />
                    }
                </Box>
                {!miniMode && <Text fontSize={`${fontSize}px`} fontWeight={fontWeight} >{title}</Text>}
            </HStack>
            <Modal isOpen={isOpen} onClose={onClose} size="full">
                <ModalContent ml={`${sideWidth}px`}>
                    <ModalHeader justifyContent="space-between">
                        <Flex justifyContent="space-between" alignItems="center">
                            <Text>Search dashboard</Text>
                            <FaTimes opacity="0.6" cursor="pointer" onClick={onClose} />
                        </Flex>
                    </ModalHeader>
                    <ModalBody>
                        <Flex justifyContent="space-between" alignItems="center" mb="2">
                            <HStack>
                                <Input value={query} onChange={e => onQueryChange(e.currentTarget.value)} maxWidth="400px" placeholder="enter dashboard name or id to search.." />
                                <Tooltip label={caseSensitive ? "Case sensitive" : "Case insensitive"}>
                                    <Box
                                        cursor="pointer"
                                        onClick={() => setCaseSensitive(!caseSensitive)}
                                        color={caseSensitive ? "brand.500" : "inherit"}
                                        fontWeight="600"
                                        className={caseSensitive ? "highlight-bordered" : null}
                                        p="1"
                                        fontSize="1.1rem"
                                    >
                                        <RxLetterCaseCapitalize />
                                    </Box>
                                </Tooltip>
                            </HStack>
                            <HStack>

                            </HStack>
                        </Flex>
                        {dashboards?.length > 0 && <SearchResults dashboards={dashboards} onItemClick={onClose}/>}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
})

export default Search