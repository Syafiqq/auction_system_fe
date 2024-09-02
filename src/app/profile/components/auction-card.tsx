import React from "react";

class AuctionCard extends React.Component<{
    onClick: () => void,
    image: string | null | undefined,
    status: string | null
    name: string | null
}> {
    render() {
        return <div
            onClick={this.props.onClick}
            className="relative w-[160px] h-[213px] bg-gray-300 rounded overflow-hidden flex-shrink-0 border border-gray-300"
            style={{
                backgroundImage: `url(${this.props.image ?? "/image_not_found.png"})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
            }}
        >
            {
                this.props.status === null
                    ? null
                    :
                    <div
                        className="absolute top-2 right-2 bg-black bg-opacity-60 px-2 py-1 text-white text-xs rounded">
                        {this.props.status}
                    </div>
            }
            {
                this.props.name === null
                    ? null
                    :
                    <div className="absolute inset-0 flex items-end">
                        <div className="w-full bg-black bg-opacity-60 p-2 text-white text-center line-clamp-2">
                            <span className="font-bold text-sm">
                              {this.props.name}
                            </span>
                        </div>
                    </div>
            }
        </div>;
    }
}

export default AuctionCard;
