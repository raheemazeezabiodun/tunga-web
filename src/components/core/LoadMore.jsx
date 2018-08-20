import React from 'react';
import Button from "./Button";
import Progress from "./Progress";

const LoadMore = ({children, onLoadMore, hasMore=true, isLoadingMore=false}) => {

    return isLoadingMore?(
        <Progress/>
    ):(hasMore?(
        <div className="text-center">
            <Button size="sm" onClick={onLoadMore}>{children || 'Load More'}</Button>
        </div>
    ):null);
};

export default LoadMore;
