import React from 'react';
import Button from "./Button";
import Progress from "./Progress";

const LoadMore = ({children, onLoadMore, hasMore=true, isLoadingMore=false, variant, size='sm'}) => {

    return isLoadingMore?(
        <Progress/>
    ):(hasMore?(
        <div className="text-center">
            <Button {...variant?{variant}:{}} {...size?{size}:{}} size="sm" onClick={onLoadMore}>{children || 'Load More'}</Button>
        </div>
    ):null);
};

export default LoadMore;
