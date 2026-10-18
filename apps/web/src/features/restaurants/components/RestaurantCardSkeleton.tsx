import Skeleton from "../../../components/ui/Skeleton/Skeleton";

export default function RestaurantCardSkeleton() {
  return (
    <div className="restaurant-card">
      <div className="restaurant-card__image">
        <Skeleton height="100%" borderRadius="12px" />
      </div>

      <div className="restaurant-card__body">
        <Skeleton width="70%" height="14px" />
        <div style={{ marginTop: 8 }}>
          <Skeleton width="90%" height="12px" />
        </div>
        <div style={{ marginTop: 6 }}>
          <Skeleton width="50%" height="12px" />
        </div>
      </div>
    </div>
  );
}