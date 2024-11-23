import BadgeDto from '../../../../core/api/investment/dto/badge';
import { BADGES_LABEL } from '../../../../strings';
import BorderLabel from '../../../containers/border-label/BorderLabel';
import Badge from '../badge/Badge';

export default function BadgesArea(props: { badges: BadgeDto[] }) {
  const { badges } = props;
  return (
    badges?.length > 0 && (
      <BorderLabel label={BADGES_LABEL}>
        <div className="flex flex-wrap gap-2">
          {badges.map(({ name, icon, primary, secondary }: BadgeDto, index) => (
            <Badge
              text={name}
              iconName={icon}
              primaryColor={primary}
              backgroundColor={secondary}
              key={index}
            />
          ))}
        </div>
      </BorderLabel>
    )
  );
}
