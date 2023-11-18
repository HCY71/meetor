import { HStack, VStack, Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react"

const PageSkeleton = () => {
    return (
        <VStack align='center' w='100%'>
            <Skeleton w='40%' h='52px' />
            <Skeleton w='60%' h='52px' />
            <div className="fully-hidden-tag">Create an Event
                Scheduler and Simply Share It.</div>

            <div className="fully-hidden-tag">1,867 events scheduled.</div>

            <VStack w='100%' mt={ 16 } gap={ 8 }>
                <VStack w='100%'>
                    <HStack w='45%' >
                        <SkeletonCircle size='8' />
                        <SkeletonText noOfLines={ 1 } w='30%' skeletonHeight='12px' />
                        <div className="fully-hidden-tag">Give your event a name.</div>
                        <div className="fully-hidden-tag">[placeholder] an important discussion</div>
                    </HStack>
                    <Skeleton w='45%' h='52px' />
                </VStack>
                <VStack w='100%'>
                    <HStack w='45%'>
                        <SkeletonCircle size='8' />
                        <SkeletonText noOfLines={ 1 } w='30%' skeletonHeight='12px' />
                        <div className="fully-hidden-tag">Choose your dates: Days | Dates</div>
                    </HStack>
                    <VStack w='45%' alignItems='flex-start'>
                        <Skeleton w='100%' h='52px' />
                        <SkeletonText noOfLines={ 1 } w='40%' skeletonHeight='12px' />
                        <Skeleton w='100%' h='160px' />
                        <div className="fully-hidden-tag">You can drag to multi-select</div>
                        <div class="fully-hidden-tag"><div class="chakra-stack css-e016vf"><div class="css-17nm68h"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" focusable="false" class="chakra-icon css-1cafihd" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"></path></svg></div><div class="chakra-stack css-1g13qqn"><div class="css-gmuwbf">November 2023</div><div class="css-1btyird">BACK</div></div><div class="css-w9rp2o"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" focusable="false" class="chakra-icon css-17x85b3" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"></path></svg></div></div><div class="chakra-stack css-zirws9"><div class="css-1lads1q">MON</div><div class="css-1lads1q">TUE</div><div class="css-1lads1q">WED</div><div class="css-1lads1q">THU</div><div class="css-1lads1q">FRI</div><div class="css-1lads1q">SAT</div><div class="css-1lads1q">SUN</div></div><div role="group" class="chakra-form-control css-1kxonj9"><div class="css-kbl0ao"><div class="no-touch-action css-jhwn6l">30</div><div class="no-touch-action css-jhwn6l">31</div><div class="no-touch-action css-jhwn6l">1</div><div class="no-touch-action css-jhwn6l">2</div><div class="no-touch-action css-jhwn6l">3</div><div class="no-touch-action css-jhwn6l">4</div><div class="no-touch-action css-jhwn6l">5</div><div class="no-touch-action css-jhwn6l">6</div><div class="no-touch-action css-jhwn6l">7</div><div class="no-touch-action css-jhwn6l">8</div><div class="no-touch-action css-jhwn6l">9</div><div class="no-touch-action css-jhwn6l">10</div><div class="no-touch-action css-jhwn6l">11</div><div class="no-touch-action css-jhwn6l">12</div><div class="no-touch-action css-jhwn6l">13</div><div class="no-touch-action css-jhwn6l">14</div><div class="no-touch-action css-jhwn6l">15</div><div class="no-touch-action css-jhwn6l">16</div><div class="no-touch-action css-jhwn6l">17</div><div class="no-touch-action css-1c8zg8u">18</div><div class="no-touch-action css-11ux4k6">19</div><div class="no-touch-action css-11ux4k6">20</div><div class="no-touch-action css-11ux4k6">21</div><div class="no-touch-action css-11ux4k6">22</div><div class="no-touch-action css-11ux4k6">23</div><div class="no-touch-action css-11ux4k6">24</div><div class="no-touch-action css-11ux4k6">25</div><div class="no-touch-action css-11ux4k6">26</div><div class="no-touch-action css-11ux4k6">27</div><div class="no-touch-action css-11ux4k6">28</div><div class="no-touch-action css-11ux4k6">29</div><div class="no-touch-action css-11ux4k6">30</div><div class="no-touch-action css-ok3lft">1</div><div class="no-touch-action css-ok3lft">2</div><div class="no-touch-action css-ok3lft">3</div></div></div></div>
                    </VStack>
                </VStack>
                <VStack w='100%'>
                    <HStack w='45%'>
                        <SkeletonCircle size='8' />
                        <SkeletonText noOfLines={ 1 } w='30%' skeletonHeight='12px' />
                        <div className="fully-hidden-tag">Set a time range | All day()</div>
                    </HStack>
                    <Skeleton w='45%' h='52px' />
                    <div className="fully-hidden-tag">Submit</div>
                </VStack>
            </VStack>
        </VStack>
    )
}

export default PageSkeleton